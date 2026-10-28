import { useState, useEffect } from 'react';
import Dexie from 'dexie';
import './ColonyManager.css';

// ── Database Setup with Dexie (IndexedDB) ──
const db = new Dexie('ReWasteColonyDB');
db.version(1).stores({
  batches: '++id, batchNumber, satelliteName, dateInoculation, dolKg, wasteKg, wasteType, harvestKg, frassKg, temp, humidity, status, createdAt'
});

export default function ColonyManager() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'new' | 'cycle'

  // Form State
  const [form, setForm] = useState({
    batchNumber: `LOT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
    satelliteName: 'Ferme Satellite Abobo',
    dateInoculation: new Date().toISOString().split('T')[0],
    dolKg: 2.5,
    wasteKg: 100,
    wasteType: 'Fruits & Marchés',
    harvestKg: 22,
    frassKg: 35,
    temp: 28,
    humidity: 72,
    notes: 'Excellente voracité larvaire observée à J+4',
    status: 'Terminé'
  });

  const [notification, setNotification] = useState('');

  // Load Batches from Dexie
  const loadBatches = async () => {
    try {
      const allBatches = await db.batches.reverse().toArray();
      if (allBatches.length === 0) {
        // Preload sample realistic batches from business plan
        const sampleBatches = [
          {
            batchNumber: 'LOT-2026-084',
            satelliteName: 'Pépinière Centrale Cocody',
            dateInoculation: '2026-09-15',
            dolKg: 5,
            wasteKg: 200,
            wasteType: 'Fruits & Légumes Déclassés',
            harvestKg: 46,
            frassKg: 70,
            temp: 29,
            humidity: 75,
            notes: 'Cycle 12j régulier. Séchage Pop-larvae prévu.',
            status: 'Terminé',
            createdAt: new Date('2026-09-15').toISOString()
          },
          {
            batchNumber: 'LOT-2026-085',
            satelliteName: 'Ferme Satellite Bingerville',
            dateInoculation: '2026-09-22',
            dolKg: 3,
            wasteKg: 120,
            wasteType: 'Drêches de Brasserie',
            harvestKg: 28,
            frassKg: 42,
            temp: 27,
            humidity: 70,
            notes: 'Forte teneur en protéines du substrat.',
            status: 'En cours',
            createdAt: new Date('2026-09-22').toISOString()
          }
        ];
        await db.batches.bulkAdd(sampleBatches);
        const reloaded = await db.batches.reverse().toArray();
        setBatches(reloaded);
      } else {
        setBatches(allBatches);
      }
    } catch (err) {
      console.error('Erreur IndexedDB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Calculations for KPI
  const computeKpis = (dol, waste, harvest, frass) => {
    const d = parseFloat(dol) || 0;
    const w = parseFloat(waste) || 0;
    const h = parseFloat(harvest) || 0;
    const f = parseFloat(frass) || 0;

    const bcr = w > 0 ? (((h - d) / w) * 100).toFixed(1) : 0;
    const wwr = w > 0 ? (((w - f) / w) * 100).toFixed(1) : 0;
    const survivalRate = d > 0 ? Math.min(100, Math.round(((h / (d * 5)) * 100) + 70)) : 90;

    return { bcr: parseFloat(bcr), wwr: parseFloat(wwr), survivalRate };
  };

  const currentKpi = computeKpis(form.dolKg, form.wasteKg, form.harvestKg, form.frassKg);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.batches.add({
        ...form,
        dolKg: parseFloat(form.dolKg),
        wasteKg: parseFloat(form.wasteKg),
        harvestKg: parseFloat(form.harvestKg),
        frassKg: parseFloat(form.frassKg),
        temp: parseFloat(form.temp),
        humidity: parseFloat(form.humidity),
        createdAt: new Date().toISOString()
      });
      showToast(`✅ Lot ${form.batchNumber} enregistré en local (IndexedDB) !`);
      setForm({
        batchNumber: `LOT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
        satelliteName: form.satelliteName,
        dateInoculation: new Date().toISOString().split('T')[0],
        dolKg: 2.5,
        wasteKg: 100,
        wasteType: 'Fruits & Marchés',
        harvestKg: 22,
        frassKg: 35,
        temp: 28,
        humidity: 72,
        notes: '',
        status: 'En cours'
      });
      await loadBatches();
      setActiveTab('list');
    } catch (err) {
      console.error(err);
      showToast('❌ Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer définitivement cet enregistrement de lot ?')) {
      await db.batches.delete(id);
      showToast('🗑️ Lot supprimé');
      await loadBatches();
    }
  };

  return (
    <div className="colony-manager">
      <div className="colony-manager__header">
        <div className="colony-manager__badge-bar">
          <span className="colony-badge colony-badge--live">
            🟢 Mode Hors-Ligne Actif (IndexedDB Local)
          </span>
          <span className="colony-badge colony-badge--sync">
            🔄 Synchronisation Ferme Satellite
          </span>
        </div>
        <h3 className="colony-manager__title">
          🐛 Colony Manager — Suivi du Cycle 12 Jours
        </h3>
        <p className="colony-manager__desc">
          Outil SaaS local-first destiné aux opérateurs de la Pépinière Centrale et des unités satellites partenaires.
          Saisie sans connexion, calcul instantané du taux de bioconversion (BCR), de réduction (WWR) et alertes de biosécurité.
        </p>

        {/* Tab Navigation */}
        <div className="colony-tabs">
          <button
            className={`colony-tab ${activeTab === 'list' ? 'colony-tab--active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 Registre des Lots ({batches.length})
          </button>
          <button
            className={`colony-tab ${activeTab === 'new' ? 'colony-tab--active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            ➕ Saisir un Nouveau Lot
          </button>
          <button
            className={`colony-tab ${activeTab === 'cycle' ? 'colony-tab--active' : ''}`}
            onClick={() => setActiveTab('cycle')}
          >
            📅 Protocole & Rationnement (12 Jours)
          </button>
        </div>
      </div>

      {notification && (
        <div className="colony-toast">
          {notification}
        </div>
      )}

      {/* ── TAB 1: LISTE DES LOTS ── */}
      {activeTab === 'list' && (
        <div className="colony-content">
          {loading ? (
            <p className="colony-loading">Chargement des données locales...</p>
          ) : batches.length === 0 ? (
            <div className="colony-empty">
              <p>Aucun lot enregistré pour le moment.</p>
              <button className="btn btn--primary" onClick={() => setActiveTab('new')}>
                Créer le premier lot
              </button>
            </div>
          ) : (
            <div className="colony-grid">
              {batches.map((batch) => {
                const kpis = computeKpis(batch.dolKg, batch.wasteKg, batch.harvestKg, batch.frassKg);
                const isTempAlert = batch.temp < 24 || batch.temp > 32;
                const isBcrAlert = kpis.bcr < 12;

                return (
                  <div key={batch.id} className="colony-card">
                    <div className="colony-card__head">
                      <div>
                        <span className="colony-card__num">{batch.batchNumber}</span>
                        <h4 className="colony-card__site">{batch.satelliteName}</h4>
                      </div>
                      <span className={`colony-card__status colony-card__status--${batch.status === 'Terminé' ? 'done' : 'active'}`}>
                        {batch.status}
                      </span>
                    </div>

                    <div className="colony-card__date">
                      🗓️ Inoculation : <strong>{batch.dateInoculation}</strong> (Substrat : {batch.wasteType})
                    </div>

                    {/* KPIs Metrics */}
                    <div className="colony-metrics">
                      <div className={`colony-metric ${isBcrAlert ? 'colony-metric--warn' : 'colony-metric--good'}`}>
                        <span className="colony-metric__label">Taux BCR</span>
                        <strong className="colony-metric__val">{kpis.bcr}%</strong>
                        <span className="colony-metric__sub">Cible ≥ 18%</span>
                      </div>
                      <div className="colony-metric colony-metric--good">
                        <span className="colony-metric__label">Réduction WWR</span>
                        <strong className="colony-metric__val">{kpis.wwr}%</strong>
                        <span className="colony-metric__sub">Déchets détournés</span>
                      </div>
                      <div className="colony-metric">
                        <span className="colony-metric__label">Survie estimée</span>
                        <strong className="colony-metric__val">{kpis.survivalRate}%</strong>
                        <span className="colony-metric__sub">Densité saine</span>
                      </div>
                    </div>

                    {/* Operational Details */}
                    <div className="colony-details">
                      <div className="colony-detail-row">
                        <span>🐛 5-DOL inoculées :</span>
                        <strong>{batch.dolKg} kg</strong>
                      </div>
                      <div className="colony-detail-row">
                        <span>🗑️ Biodéchets traités :</span>
                        <strong>{batch.wasteKg} kg</strong>
                      </div>
                      <div className="colony-detail-row">
                        <span>✨ Récolte larves :</span>
                        <strong>{batch.harvestKg} kg</strong>
                      </div>
                      <div className="colony-detail-row">
                        <span>🌍 Frass obtenu :</span>
                        <strong>{batch.frassKg} kg</strong>
                      </div>
                      <div className="colony-detail-row">
                        <span>🌡️ Conditions T° / Humidité :</span>
                        <strong className={isTempAlert ? 'text-warning' : ''}>
                          {batch.temp}°C / {batch.humidity}% {isTempAlert && '⚠️'}
                        </strong>
                      </div>
                    </div>

                    {batch.notes && (
                      <div className="colony-notes">
                        <em>📝 {batch.notes}</em>
                      </div>
                    )}

                    {/* Warnings */}
                    {isBcrAlert && (
                      <div className="colony-alert">
                        ⚠️ <strong>Alerte BCR faible ({kpis.bcr}%) :</strong> Vérifier l'aération du substrat et la teneur en humidité (test du poing serré 70-80%).
                      </div>
                    )}
                    {isTempAlert && (
                      <div className="colony-alert">
                        ⚠️ <strong>Alerte thermique ({batch.temp}°C) :</strong> Température hors de la plage optimale (24°C - 32°C).
                      </div>
                    )}

                    <div className="colony-card__actions">
                      <button
                        className="btn-link text-danger"
                        onClick={() => handleDelete(batch.id)}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: SAISIE NOUVEAU LOT ── */}
      {activeTab === 'new' && (
        <form className="colony-form" onSubmit={handleSubmit}>
          <div className="colony-form__grid">
            <div className="form-group">
              <label>Numéro de Lot unique</label>
              <input
                type="text"
                required
                value={form.batchNumber}
                onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Unité / Ferme Satellite</label>
              <select
                value={form.satelliteName}
                onChange={(e) => setForm({ ...form, satelliteName: e.target.value })}
              >
                <option value="Pépinière Centrale Cocody">Pépinière Centrale Cocody (Le Vallon)</option>
                <option value="Ferme Satellite Abobo">Ferme Satellite Abobo</option>
                <option value="Ferme Satellite Bingerville">Ferme Satellite Bingerville</option>
                <option value="Unité Partenaire Yopougon">Unité Partenaire Yopougon</option>
                <option value="Autre Exploitation Satellite">Autre Exploitation Satellite</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date d'Inoculation (Jour 0)</label>
              <input
                type="date"
                required
                value={form.dateInoculation}
                onChange={(e) => setForm({ ...form, dateInoculation: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Type de Substrat Organique</label>
              <select
                value={form.wasteType}
                onChange={(e) => setForm({ ...form, wasteType: e.target.value })}
              >
                <option value="Fruits & Marchés">Fruits & Marchés de gros</option>
                <option value="Restes de Restauration">Restes de cantines & restauration</option>
                <option value="Drêches de Brasserie">Drêches de brasserie / céréales</option>
                <option value="Épluchures de Manioc">Épluchures de manioc / tubercules</option>
                <option value="Mixte Agro-alimentaire">Mixte agro-alimentaire</option>
              </select>
            </div>

            <div className="form-group">
              <label>Poids 5-DOL inoculées (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={form.dolKg}
                onChange={(e) => setForm({ ...form, dolKg: e.target.value })}
              />
              <span className="form-hint">1 kg ≈ 35 000 jeunes larves de 5 jours</span>
            </div>

            <div className="form-group">
              <label>Poids de Substrat Distribué (kg)</label>
              <input
                type="number"
                step="1"
                min="10"
                required
                value={form.wasteKg}
                onChange={(e) => setForm({ ...form, wasteKg: e.target.value })}
              />
              <span className="form-hint">Capacité bac conseillée : 31,25 kg/m²/jour</span>
            </div>

            <div className="form-group">
              <label>Poids Larves Récoltées (kg)</label>
              <input
                type="number"
                step="0.5"
                required
                value={form.harvestKg}
                onChange={(e) => setForm({ ...form, harvestKg: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Poids Frass Obtenu (kg)</label>
              <input
                type="number"
                step="1"
                required
                value={form.frassKg}
                onChange={(e) => setForm({ ...form, frassKg: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Température du Substrat (°C)</label>
              <input
                type="number"
                step="0.5"
                required
                value={form.temp}
                onChange={(e) => setForm({ ...form, temp: e.target.value })}
              />
              <span className="form-hint">Plage optimale : 26°C à 31°C</span>
            </div>

            <div className="form-group">
              <label>Humidité Relative (%)</label>
              <input
                type="number"
                step="1"
                min="10"
                max="100"
                required
                value={form.humidity}
                onChange={(e) => setForm({ ...form, humidity: e.target.value })}
              />
              <span className="form-hint">Optimal : 70% à 80% (test du poing)</span>
            </div>
          </div>

          {/* Real-time KPI Preview */}
          <div className="colony-form__kpi-preview">
            <h5>📊 Aperçu des Performances Calculées en Direct :</h5>
            <div className="colony-kpi-pill-group">
              <span className={`colony-kpi-pill ${currentKpi.bcr < 12 ? 'colony-kpi-pill--warn' : 'colony-kpi-pill--good'}`}>
                Taux de Bioconversion (BCR) : <strong>{currentKpi.bcr}%</strong>
              </span>
              <span className="colony-kpi-pill colony-kpi-pill--good">
                Réduction de Matière (WWR) : <strong>{currentKpi.wwr}%</strong>
              </span>
              <span className="colony-kpi-pill">
                Taux de survie estimé : <strong>{currentKpi.survivalRate}%</strong>
              </span>
            </div>
          </div>

          <div className="form-group form-group--full">
            <label>Observations Terrain & Notes d'Élevage</label>
            <textarea
              rows="3"
              placeholder="Ex: comportement larvaire, odeur, présence éventuelle de mouches domestiques ou prédateurs..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="colony-form__actions">
            <button type="submit" className="btn btn--primary btn--lg">
              💾 Enregistrer le Lot dans la Base Locale
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setActiveTab('list')}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 3: CALENDRIER DE RATIONNEMENT 12 JOURS ── */}
      {activeTab === 'cycle' && (
        <div className="colony-cycle">
          <h4 className="colony-cycle__title">
            ⏱️ Protocole Circulaire de Rationnement Nurserie (Code Couleur)
          </h4>
          <p className="colony-cycle__desc">
            Pour maximiser le BCR et éviter la surchauffe larvaire, appliquez scrupuleusement la règle des 3 phases sur le cycle de 12 jours :
          </p>

          <div className="colony-timeline">
            <div className="colony-step colony-step--green">
              <div className="colony-step__badge">J0 à J4 — Phase 1</div>
              <h5>Démarrage & Inoculation (Vert)</h5>
              <p><strong>30% de la ration totale.</strong> Substrat fin et broyé. Aliment humide : provende poulet 70% + 30% eau. Température maintenue à 28°C-30°C.</p>
              <ul>
                <li>Vérifier la dispersion des 5-DOL</li>
                <li>Pièges à fourmis actifs (pieds des bacs immergés)</li>
                <li>Humidité 75% contrôlée</li>
              </ul>
            </div>

            <div className="colony-step colony-step--orange">
              <div className="colony-step__badge">J5 à J9 — Phase 2</div>
              <h5>Voracité & Croissance Active (Orange)</h5>
              <p><strong>60% de la ration totale.</strong> Apport principal de biodéchets pré-broyés. Taux de dégradation maximal (jusqu'à 15 kg/m²/jour).</p>
              <ul>
                <li>Contrôler l'odeur (pas d'ammoniac)</li>
                <li>Brassage léger si tassement</li>
                <li>Vérifier l'absence de fuite des larves</li>
              </ul>
            </div>

            <div className="colony-step colony-step--blue">
              <div className="colony-step__badge">J10 à J12 — Phase 3</div>
              <h5>Maturation & Pré-récolte (Bleu)</h5>
              <p><strong>10% restant puis arrêt d'alimentation.</strong> Humidification fine (100% eau) pour stimuler la purge et préparer le tamisage vibrant.</p>
              <ul>
                <li>Les larves virent au beige/brun clair</li>
                <li>Séparation mécanique au tamis vibrant</li>
                <li>Transfert vers unité centrale : séchage Pop-larvae</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
