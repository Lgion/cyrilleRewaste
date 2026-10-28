import { useState } from 'react';
import { FORMATIONS, PRODUCTS, CONTACT } from '../data/siteData';
import './AdminModal.css';

export default function AdminModal({
  isOpen,
  onClose,
  currency,
  onCurrencyChange,
  reservations = [],
  onUpdateReservations
}) {
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'reservations' | 'catalog' | 'stats'
  const [currentCurrency, setCurrentCurrency] = useState(currency);
  const [adminEmail, setAdminEmail] = useState(CONTACT.cyrille.email);
  const [exchangeRate, setExchangeRate] = useState(625);
  const [saveToast, setSaveToast] = useState('');

  // Sample or state-based reservations
  const [localReservations, setLocalReservations] = useState([
    {
      id: 'RES-2026-001',
      client: 'Mamadou Koné',
      phone: '+225 07 11 22 33 44',
      formation: 'Formation Pratique (3j)',
      participants: 1,
      paymentMethod: 'Wave CI (Confirmé)',
      amount: 150000,
      date: '2026-10-10',
      status: 'Confirmé'
    },
    {
      id: 'RES-2026-002',
      client: 'Awa Diallo',
      phone: '+225 05 99 88 77 66',
      formation: 'Formation Business (5j)',
      participants: 2,
      paymentMethod: 'Espèces sur site',
      amount: 700000,
      date: '2026-10-15',
      status: 'En attente'
    }
  ]);

  if (!isOpen) return null;

  const handleSaveConfig = (e) => {
    e.preventDefault();
    onCurrencyChange(currentCurrency);
    setSaveToast('✅ Configuration et devise mises à jour avec succès !');
    setTimeout(() => setSaveToast(''), 3500);
  };

  const handleStatusChange = (id, newStatus) => {
    setLocalReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
  };

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="admin-modal__header">
          <div className="admin-modal__title-box">
            <span className="admin-badge">🔐 Administration Sécurisée</span>
            <h3>Tableau de Bord ReWaste BSF</h3>
            <p className="admin-subtitle">
              Gestionnaire des opérations centrales : Cyrille & Kouessi Émile Hognikou
            </p>
          </div>
          <button className="admin-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'config' ? 'admin-nav-item--active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            ⚙️ Paramètres & Devises
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'reservations' ? 'admin-nav-item--active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            🎓 Réservations ({localReservations.length})
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'catalog' ? 'admin-nav-item--active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            📦 Tarifs & Stocks
          </button>
        </div>

        {saveToast && <div className="admin-toast">{saveToast}</div>}

        {/* Modal Body */}
        <div className="admin-modal__body">
          {/* TAB 1: Configuration & Devises */}
          {activeTab === 'config' && (
            <form className="admin-form" onSubmit={handleSaveConfig}>
              <div className="admin-section">
                <h4>💱 Paramétrage de la Devise Globale du Site & B2B</h4>
                <p className="admin-hint">
                  Définissez la devise par défaut affichée sur la plateforme et le portail B2B Gate Fees.
                </p>

                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>Devise Active par Défaut</label>
                    <select
                      value={currentCurrency}
                      onChange={(e) => setCurrentCurrency(e.target.value)}
                    >
                      <option value="FCFA">Franc CFA (FCFA) — Marché Local & Sous-Région</option>
                      <option value="USD">Dollar Américain (USD - $) — Présentations Internationales</option>
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Taux de Conversion (1 USD en FCFA)</label>
                    <input
                      type="number"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-section">
                <h4>📧 Contacts Administratifs</h4>
                <div className="admin-field-row">
                  <div className="admin-field">
                    <label>Email Notification Principale (Cyrille)</label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Wave Merchant ID</label>
                    <input
                      type="text"
                      disabled
                      value="M_ci_hsvjN_ywTw2K"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-actions">
                <button type="submit" className="btn btn--primary btn--lg">
                  💾 Enregistrer les Modifications
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Réservations Formations */}
          {activeTab === 'reservations' && (
            <div className="admin-reservations">
              <div className="admin-res-info">
                <span>Rappel jauge : <strong>Max 12 participants par session pratique</strong> (Scénario 2 Business Plan).</span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Réf</th>
                    <th>Participant</th>
                    <th>Formation</th>
                    <th>Règlement</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {localReservations.map((res) => (
                    <tr key={res.id}>
                      <td><strong>{res.id}</strong></td>
                      <td>
                        {res.client}<br/>
                        <small className="text-muted">{res.phone}</small>
                      </td>
                      <td>{res.formation}</td>
                      <td>
                        {res.amount.toLocaleString()} FCFA<br/>
                        <span className="badge badge--sm">{res.paymentMethod}</span>
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${res.status === 'Confirmé' ? 'success' : 'pending'}`}>
                          {res.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={res.status}
                          onChange={(e) => handleStatusChange(res.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="Confirmé">Confirmé</option>
                          <option value="En attente">En attente</option>
                          <option value="Annulé">Annulé</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Catalogue & Stocks */}
          {activeTab === 'catalog' && (
            <div className="admin-catalog">
              <h4>📦 Synthèse des Références Officielles ReWaste</h4>
              <div className="admin-catalog-grid">
                {PRODUCTS.map((prod) => (
                  <div key={prod.id} className="admin-prod-card">
                    <div className="admin-prod-icon">{prod.icon}</div>
                    <div className="admin-prod-info">
                      <strong>{prod.name}</strong>
                      <span className="text-muted">{prod.unit}</span>
                      <strong className="text-emerald">{prod.priceFCFA}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
