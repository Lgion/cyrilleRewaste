import { useState, useEffect } from 'react';
import { FORMATIONS, PRODUCTS, CONTACT } from '../data/siteData';
import jsPDF from 'jspdf';
import './AdminDashboard.css';

export default function AdminDashboard({ onNavigateHome, currency = 'FCFA', onCurrencyChange }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'formations' | 'boutique' | 'b2b' | 'satellites' | 'settings'
  const [toastMessage, setToastMessage] = useState('');

  // ── CRM Formations State ──
  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('rewaste_admin_reservations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'RES-2026-101',
        name: 'Mamadou Koné',
        phone: '+225 07 11 22 33 44',
        email: 'kone.mamadou@gmail.com',
        formationId: 'elevage-pratique',
        formationTitle: 'Formation Pratique (3j)',
        date: '2026-10-14',
        participants: 1,
        totalFCFA: 150000,
        paymentMethod: 'Wave CI',
        status: 'Confirmé',
        notes: 'Aviculteur à Bouaké, souhaite remplacer le tourteau de soja.'
      },
      {
        id: 'RES-2026-102',
        name: 'Awa Diallo',
        phone: '+225 05 88 77 66 55',
        email: 'awa.diallo@africagri.ci',
        formationId: 'business-pepiniere',
        formationTitle: 'Formation Business & Pépinière (5j)',
        date: '2026-10-21',
        participants: 2,
        totalFCFA: 700000,
        paymentMethod: 'Espèces / Chèque',
        status: 'En attente',
        notes: 'Coopérative agricole Abidjan Sud, projet de 1t/jour.'
      },
      {
        id: 'RES-2026-103',
        name: 'Jean-Baptiste Kouassi',
        phone: '+225 01 22 44 66 88',
        email: 'jbk.kouassi@yahoo.fr',
        formationId: 'initiation-express',
        formationTitle: 'Initiation Express (1j)',
        date: '2026-10-07',
        participants: 1,
        totalFCFA: 50000,
        paymentMethod: 'Wave CI',
        status: 'Confirmé',
        notes: 'Particulier passionné de valorisation de biodéchets ménagers.'
      },
      {
        id: 'RES-2026-104',
        name: 'Dr. Bakary Traoré',
        phone: '+225 07 99 33 11 22',
        email: 'b.traore@agrofeed.ci',
        formationId: 'maitrise-ponte',
        formationTitle: 'Maîtrise de la Reproduction & Nurserie (2j)',
        date: '2026-11-04',
        participants: 1,
        totalFCFA: 120000,
        paymentMethod: 'Virement bancaire',
        status: 'En attente',
        notes: 'Vétérinaire et formateur piscicole à Grand-Bassam.'
      }
    ];
  });

  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationFilterStatus, setReservationFilterStatus] = useState('Tous');

  // New reservation modal form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    formationTitle: 'Formation Pratique (3j)',
    participants: 1,
    totalFCFA: 150000,
    paymentMethod: 'Wave CI',
    status: 'Confirmé',
    notes: ''
  });

  // ── Boutique Products State ──
  const [productsList, setProductsList] = useState(() => {
    const saved = localStorage.getItem('rewaste_admin_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return PRODUCTS.map(p => ({
      ...p,
      stockStatus: 'In Stock',
      customPrice: p.priceFCFA ? parseInt(p.priceFCFA.replace(/\s+/g, ''), 10) : 15000
    }));
  });

  // ── B2B Settings State ──
  const [b2bSettings, setB2bSettings] = useState(() => {
    const saved = localStorage.getItem('rewaste_admin_b2b');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      gateFeePerTon: 25000,
      landfillFeePerTon: 45000,
      carbonFactorPerTon: 1.5,
      activeContractCount: 6,
      monthlyTonnageExpected: 45
    };
  });

  // ── General System Settings State ──
  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('rewaste_admin_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      waveMerchantPhone: '+225 07 04 76 31 32',
      cyrillePhone: '+225 07 04 76 31 32',
      emilePhone: '+225 05 06 12 34 56',
      contactEmail: 'contact@rewaste.ci',
      activeCurrency: currency || 'FCFA',
      exchangeRateUSD: 615,
      exchangeRateEUR: 655.957
    };
  });

  // Persist reservations
  useEffect(() => {
    localStorage.setItem('rewaste_admin_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Persist products
  useEffect(() => {
    localStorage.setItem('rewaste_admin_products', JSON.stringify(productsList));
  }, [productsList]);

  // Persist B2B
  useEffect(() => {
    localStorage.setItem('rewaste_admin_b2b', JSON.stringify(b2bSettings));
  }, [b2bSettings]);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('rewaste_admin_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Status updates
  const handleUpdateStatus = (id, newStatus) => {
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
    showToast(`✅ Statut de ${id} mis à jour : ${newStatus}`);
  };

  // Add reservation
  const handleAddReservation = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) {
      alert('Veuillez renseigner au moins le nom et le téléphone.');
      return;
    }
    const newEntry = {
      id: `RES-2026-${Math.floor(100 + Math.random() * 900)}`,
      ...newClient,
      date: new Date().toISOString().split('T')[0]
    };
    setReservations([newEntry, ...reservations]);
    setShowAddModal(false);
    setNewClient({
      name: '',
      phone: '',
      email: '',
      formationTitle: 'Formation Pratique (3j)',
      participants: 1,
      totalFCFA: 150000,
      paymentMethod: 'Wave CI',
      status: 'Confirmé',
      notes: ''
    });
    showToast(`🎉 Inscription de ${newEntry.name} enregistrée !`);
  };

  // WhatsApp quick contact
  const handleWhatsAppContact = (r) => {
    const cleanPhone = r.phone.replace(/[^0-9]/g, '');
    const msg = `Bonjour ${r.name}, ici l'équipe ReWaste BSF (Cyrille & Émile). Concernant votre inscription à la session "${r.formationTitle}" : votre place est bien enregistrée. Avez-vous des questions pour préparer votre venue à la pépinière de Cocody ?`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Client', 'Téléphone', 'Email', 'Formation', 'Date', 'Participants', 'Total (FCFA)', 'Paiement', 'Statut'];
    const rows = reservations.map(r => [
      r.id,
      `"${r.name}"`,
      r.phone,
      r.email,
      `"${r.formationTitle}"`,
      r.date,
      r.participants,
      r.totalFCFA,
      `"${r.paymentMethod}"`,
      r.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rewaste_reservations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Fichier CSV des réservations exporté !');
  };

  // Filtered reservations
  const filteredReservations = reservations.filter(r => {
    const matchesFilter = reservationFilterStatus === 'Tous' || r.status === reservationFilterStatus;
    const matchesSearch = !reservationSearch ||
      r.name.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      r.phone.includes(reservationSearch) ||
      r.formationTitle.toLowerCase().includes(reservationSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Financial KPIs
  const totalFormationsRevenue = reservations
    .filter(r => r.status === 'Confirmé')
    .reduce((sum, r) => sum + (r.totalFCFA || 0), 0);

  const pendingFormationsRevenue = reservations
    .filter(r => r.status === 'En attente')
    .reduce((sum, r) => sum + (r.totalFCFA || 0), 0);

  const totalParticipants = reservations
    .filter(r => r.status === 'Confirmé')
    .reduce((sum, r) => sum + (r.participants || 1), 0);

  return (
    <div className="admin-page">
      {/* ── Top Header Navigation ── */}
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <div className="admin-topbar__left">
            <button className="admin-back-btn" onClick={onNavigateHome} title="Retour à l'accueil public">
              ← Revenir au site vitrine
            </button>
            <div className="admin-brand">
              <span className="admin-brand__badge">⚙️ BACK-OFFICE CENTRAL</span>
              <h1 className="admin-brand__title">ReWaste BSF Administration</h1>
            </div>
          </div>

          <div className="admin-topbar__right">
            <div className="admin-currency-selector">
              <span className="admin-curr-label">Devise active :</span>
              <button
                className={`admin-curr-btn ${systemSettings.activeCurrency === 'FCFA' ? 'active' : ''}`}
                onClick={() => {
                  setSystemSettings(prev => ({ ...prev, activeCurrency: 'FCFA' }));
                  onCurrencyChange?.('FCFA');
                  showToast('Devise passée en FCFA');
                }}
              >
                FCFA
              </button>
              <button
                className={`admin-curr-btn ${systemSettings.activeCurrency === 'USD' ? 'active' : ''}`}
                onClick={() => {
                  setSystemSettings(prev => ({ ...prev, activeCurrency: 'USD' }));
                  onCurrencyChange?.('USD');
                  showToast('Devise passée en USD ($)');
                }}
              >
                USD ($)
              </button>
              <button
                className={`admin-curr-btn ${systemSettings.activeCurrency === 'EUR' ? 'active' : ''}`}
                onClick={() => {
                  setSystemSettings(prev => ({ ...prev, activeCurrency: 'EUR' }));
                  onCurrencyChange?.('EUR');
                  showToast('Devise passée en EUR (€)');
                }}
              >
                EUR (€)
              </button>
            </div>

            <div className="admin-user-pill">
              <span className="admin-user-avatar">👨🏾‍🌾</span>
              <div className="admin-user-info">
                <span className="admin-user-name">Cyrille & Émile</span>
                <span className="admin-user-role">Super-Administrateurs</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="admin-toast-banner">
          {toastMessage}
        </div>
      )}

      {/* ── Main Layout: Sidebar & Content ── */}
      <div className="admin-layout">
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-menu">
            <button
              className={`admin-menu__item ${activeTab === 'overview' ? 'admin-menu__item--active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="admin-menu__icon">📊</span>
              <div className="admin-menu__text">
                <strong>Tableau de Bord</strong>
                <small>Vue synthétique & KPIs</small>
              </div>
            </button>

            <button
              className={`admin-menu__item ${activeTab === 'formations' ? 'admin-menu__item--active' : ''}`}
              onClick={() => setActiveTab('formations')}
            >
              <span className="admin-menu__icon">🎓</span>
              <div className="admin-menu__text">
                <strong>Inscriptions Formations</strong>
                <small>{reservations.filter(r => r.status === 'En attente').length} en attente</small>
              </div>
            </button>

            <button
              className={`admin-menu__item ${activeTab === 'boutique' ? 'admin-menu__item--active' : ''}`}
              onClick={() => setActiveTab('boutique')}
            >
              <span className="admin-menu__icon">🛒</span>
              <div className="admin-menu__text">
                <strong>Boutique & Intrants</strong>
                <small>{productsList.length} produits gérés</small>
              </div>
            </button>

            <button
              className={`admin-menu__item ${activeTab === 'b2b' ? 'admin-menu__item--active' : ''}`}
              onClick={() => setActiveTab('b2b')}
            >
              <span className="admin-menu__icon">🏢</span>
              <div className="admin-menu__text">
                <strong>Portail B2B & Gate Fees</strong>
                <small>Frais industriels & RSE</small>
              </div>
            </button>

            <button
              className={`admin-menu__item ${activeTab === 'satellites' ? 'admin-menu__item--active' : ''}`}
              onClick={() => setActiveTab('satellites')}
            >
              <span className="admin-menu__icon">🐛</span>
              <div className="admin-menu__text">
                <strong>Pépinière & Satellites</strong>
                <small>Conduite des colonies BSF</small>
              </div>
            </button>

            <button
              className={`admin-menu__item ${activeTab === 'settings' ? 'admin-menu__item--active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="admin-menu__icon">⚙️</span>
              <div className="admin-menu__text">
                <strong>Paramètres & Wave</strong>
                <small>Numéros, devises & système</small>
              </div>
            </button>
          </nav>

          <div className="admin-sidebar__footer">
            <div className="admin-pepiniere-status">
              <span className="dot-pulse"></span>
              <div>
                <strong>Pépinière Cocody</strong>
                <span>100% Opérationnelle</span>
              </div>
            </div>
            <button className="btn btn--outline btn--sm admin-quick-view-btn" onClick={onNavigateHome}>
              👁️ Voir le Site Public
            </button>
          </div>
        </aside>

        {/* Dynamic Content Pane */}
        <main className="admin-content">
          {/* ═════════════════════════════════════════════════════════════
              TAB 1: EXECUTIVE OVERVIEW (KPIs)
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="admin-pane">
              <div className="admin-pane__header">
                <div>
                  <h2 className="admin-pane__title">Tableau de Bord Exécutif</h2>
                  <p className="admin-pane__desc">
                    Vue consolidée des 5 piliers de revenus et des flux opérationnels ReWaste BSF.
                  </p>
                </div>
                <div className="admin-header-actions">
                  <button className="btn btn--primary btn--sm" onClick={() => setActiveTab('formations')}>
                    🎓 Voir les inscriptions →
                  </button>
                </div>
              </div>

              {/* Top Stat Cards */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card admin-kpi-card--green">
                  <div className="admin-kpi-card__icon">💰</div>
                  <div className="admin-kpi-card__content">
                    <span className="admin-kpi-card__label">CA Formations Confirmé</span>
                    <strong className="admin-kpi-card__val">
                      {totalFormationsRevenue.toLocaleString('fr-FR')} {systemSettings.activeCurrency}
                    </strong>
                    <span className="admin-kpi-card__sub">
                      + {pendingFormationsRevenue.toLocaleString('fr-FR')} en cours de validation
                    </span>
                  </div>
                </div>

                <div className="admin-kpi-card admin-kpi-card--amber">
                  <div className="admin-kpi-card__icon">🎓</div>
                  <div className="admin-kpi-card__content">
                    <span className="admin-kpi-card__label">Stagiaires Formés / Inscrits</span>
                    <strong className="admin-kpi-card__val">{totalParticipants} personnes</strong>
                    <span className="admin-kpi-card__sub">Sur 4 sessions programmées</span>
                  </div>
                </div>

                <div className="admin-kpi-card admin-kpi-card--blue">
                  <div className="admin-kpi-card__icon">♻️</div>
                  <div className="admin-kpi-card__content">
                    <span className="admin-kpi-card__label">Biodéchets Traités Estimés</span>
                    <strong className="admin-kpi-card__val">14,2 Tonnes</strong>
                    <span className="admin-kpi-card__sub">Valorisation par bioconversion</span>
                  </div>
                </div>

                <div className="admin-kpi-card admin-kpi-card--teal">
                  <div className="admin-kpi-card__icon">🌱</div>
                  <div className="admin-kpi-card__content">
                    <span className="admin-kpi-card__label">Impact Carbone Évité</span>
                    <strong className="admin-kpi-card__val">21,3 tCO2e</strong>
                    <span className="admin-kpi-card__sub">Méthane de décharge neutralisé</span>
                  </div>
                </div>
              </div>

              {/* 5 Pillars Revenue Breakdown */}
              <div className="admin-card" style={{ marginTop: '2rem' }}>
                <h3 className="admin-card__title">⚖️ Performance par Pilier de Revenu ReWaste</h3>
                <div className="revenue-pillars-grid">
                  <div className="pillar-item">
                    <div className="pillar-item__header">
                      <span>🎓 Formations & Masterclasses</span>
                      <strong>45% du CA</strong>
                    </div>
                    <div className="pillar-bar"><div className="pillar-bar__fill" style={{ width: '45%', background: '#1b4d3e' }}></div></div>
                    <small>Sessions 1j, 2j, 3j & 5j limitées à 12 places</small>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-item__header">
                      <span>🛒 Intrants & Kits Nurserie</span>
                      <strong>25% du CA</strong>
                    </div>
                    <div className="pillar-bar"><div className="pillar-bar__fill" style={{ width: '25%', background: '#e5a93c' }}></div></div>
                    <small>Larves 5-DOL calibrées & Love Cages modulaires</small>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-item__header">
                      <span>🏢 Gate Fees B2B (Frais Traitement)</span>
                      <strong>15% du CA</strong>
                    </div>
                    <div className="pillar-bar"><div className="pillar-bar__fill" style={{ width: '15%', background: '#0284c7' }}></div></div>
                    <small>Municipalités & Agro-industries (Gate fee / tonne)</small>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-item__header">
                      <span>🐛 SaaS Colony Manager</span>
                      <strong>10% du CA</strong>
                    </div>
                    <div className="pillar-bar"><div className="pillar-bar__fill" style={{ width: '10%', background: '#10b981' }}></div></div>
                    <small>Abonnements mensuels des fermes satellites</small>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-item__header">
                      <span>🌱 Coproduits (Frass & Biocarburant)</span>
                      <strong>5% du CA</strong>
                    </div>
                    <div className="pillar-bar"><div className="pillar-bar__fill" style={{ width: '5%', background: '#8b5cf6' }}></div></div>
                    <small>Fertilisant organique NPK & huile brute BSF</small>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Pending Alerts */}
              <div className="admin-grid-two" style={{ marginTop: '2rem' }}>
                <div className="admin-card">
                  <h3 className="admin-card__title">⚡ Alertes Opérationnelles Immédiates</h3>
                  <div className="admin-alerts-list">
                    <div className="admin-alert-row admin-alert-row--warning">
                      <span>⚠️</span>
                      <div>
                        <strong>2 Inscriptions en attente de validation Wave</strong>
                        <p>Awa Diallo (700 000 FCFA) et Dr. Bakary Traoré (120 000 FCFA)</p>
                      </div>
                      <button className="btn btn--sm btn--primary" onClick={() => setActiveTab('formations')}>
                        Examiner
                      </button>
                    </div>

                    <div className="admin-alert-row admin-alert-row--info">
                      <span>🐛</span>
                      <div>
                        <strong>Nurserie Pépinière Cocody : 4 pontes en Love Cage</strong>
                        <p>Éclosion prévue sous 72h. Prévoir 150 kg de substrat de pré-grossissement.</p>
                      </div>
                      <button className="btn btn--sm btn--outline" onClick={() => setActiveTab('satellites')}>
                        Voir lots
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card__title">📞 Contacts Opérationnels Rapides</h3>
                  <div className="admin-contact-quick-list">
                    <div className="admin-contact-card">
                      <div className="admin-contact-avatar">👤</div>
                      <div>
                        <strong>Cyrille (Gestion Commerciale & B2B)</strong>
                        <p>📞 {systemSettings.cyrillePhone}</p>
                      </div>
                    </div>
                    <div className="admin-contact-card">
                      <div className="admin-contact-avatar">👨🏾‍🔬</div>
                      <div>
                        <strong>Kouessi Émile Hognikou (Expert Bioconversion)</strong>
                        <p>📞 {systemSettings.emilePhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 2: FORMATIONS & CRM RESERVATIONS
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === 'formations' && (
            <div className="admin-pane">
              <div className="admin-pane__header">
                <div>
                  <h2 className="admin-pane__title">Gestion des Formations & Réservations</h2>
                  <p className="admin-pane__desc">
                    Suivi en direct des inscriptions, relances WhatsApp et validation des paiements Wave CI.
                  </p>
                </div>
                <div className="admin-header-actions">
                  <button className="btn btn--outline btn--sm" onClick={handleExportCSV}>
                    📥 Exporter CSV
                  </button>
                  <button className="btn btn--primary btn--sm" onClick={() => setShowAddModal(true)}>
                    + Inscrire un Stagiaire
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="admin-filter-bar">
                <div className="admin-search-box">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Rechercher par nom, téléphone, formation..."
                    value={reservationSearch}
                    onChange={(e) => setReservationSearch(e.target.value)}
                    className="admin-search-input"
                  />
                </div>

                <div className="admin-status-filters">
                  {['Tous', 'Confirmé', 'En attente', 'Annulé'].map(status => (
                    <button
                      key={status}
                      className={`admin-filter-btn ${reservationFilterStatus === status ? 'active' : ''}`}
                      onClick={() => setReservationFilterStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reservations Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Réf.</th>
                      <th>Participant</th>
                      <th>Formation</th>
                      <th>Session</th>
                      <th>Places</th>
                      <th>Montant</th>
                      <th>Moyen Paiement</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map(res => (
                      <tr key={res.id}>
                        <td><code>{res.id}</code></td>
                        <td>
                          <strong>{res.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>{res.phone}</div>
                          {res.notes && (
                            <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', maxWidth: '200px' }}>
                              📝 {res.notes}
                            </div>
                          )}
                        </td>
                        <td>{res.formationTitle}</td>
                        <td>{res.date}</td>
                        <td><span className="badge badge--leaf">{res.participants} pers.</span></td>
                        <td><strong>{res.totalFCFA?.toLocaleString('fr-FR')} {systemSettings.activeCurrency}</strong></td>
                        <td><span className="admin-badge-payment">{res.paymentMethod}</span></td>
                        <td>
                          <select
                            value={res.status}
                            onChange={(e) => handleUpdateStatus(res.id, e.target.value)}
                            className={`admin-status-select admin-status-select--${res.status.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <option value="Confirmé">✅ Confirmé</option>
                            <option value="En attente">⏳ En attente</option>
                            <option value="Annulé">❌ Annulé</option>
                          </select>
                        </td>
                        <td>
                          <div className="admin-action-btn-group">
                            <button
                              className="btn btn--whatsapp btn--xs"
                              onClick={() => handleWhatsAppContact(res)}
                              title="Contacter sur WhatsApp"
                            >
                              📲 WhatsApp
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredReservations.length === 0 && (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                          Aucune réservation trouvée pour ces critères de recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 3: BOUTIQUE & INTRANTS MANAGEMENT
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === 'boutique' && (
            <div className="admin-pane">
              <div className="admin-pane__header">
                <div>
                  <h2 className="admin-pane__title">Gestion du Catalogue Boutique & Tarifs</h2>
                  <p className="admin-pane__desc">
                    Ajustez les prix des larves 5-DOL, kits nurserie et disponibilités en direct.
                  </p>
                </div>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => showToast('💾 Catalogue et tarifs enregistrés avec succès !')}
                >
                  💾 Sauvegarder les modifications
                </button>
              </div>

              <div className="admin-products-table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Catégorie</th>
                      <th>Prix Public (FCFA)</th>
                      <th>Unité</th>
                      <th>Disponibilité</th>
                      <th>Mise en avant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((prod, idx) => (
                      <tr key={prod.id}>
                        <td>
                          <span style={{ fontSize: '1.4rem', marginRight: '0.5rem' }}>{prod.icon}</span>
                          <strong>{prod.name}</strong>
                        </td>
                        <td><span className="badge badge--leaf">{prod.category}</span></td>
                        <td>
                          <input
                            type="number"
                            value={prod.customPrice}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setProductsList(prev => prev.map((p, i) => i === idx ? { ...p, customPrice: val } : p));
                            }}
                            className="admin-price-input"
                          />
                        </td>
                        <td>{prod.unit}</td>
                        <td>
                          <select
                            value={prod.stockStatus}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProductsList(prev => prev.map((p, i) => i === idx ? { ...p, stockStatus: val } : p));
                            }}
                            className="admin-stock-select"
                          >
                            <option value="In Stock">🟢 En Stock</option>
                            <option value="Limited">🟡 Stock Limité</option>
                            <option value="Preorder">🔵 Sur Commande</option>
                            <option value="Out of Stock">🔴 Rupture</option>
                          </select>
                        </td>
                        <td>
                          <label className="admin-checkbox-label">
                            <input
                              type="checkbox"
                              checked={!!prod.highlight}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setProductsList(prev => prev.map((p, i) => i === idx ? { ...p, highlight: val } : p));
                              }}
                            />
                            <span>Bestseller</span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 4: PORTAIL B2B & GATE FEES SETTINGS
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === 'b2b' && (
            <div className="admin-pane">
              <div className="admin-pane__header">
                <div>
                  <h2 className="admin-pane__title">Paramètres Frais de Traitement (Gate Fees B2B)</h2>
                  <p className="admin-pane__desc">
                    Grille tarifaire appliquée aux collectivités, hôtels et agro-industries de Côte d'Ivoire.
                  </p>
                </div>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => showToast('✅ Paramètres B2B enregistrés !')}
                >
                  💾 Mettre à jour les taux B2B
                </button>
              </div>

              <div className="admin-grid-two">
                <div className="admin-card">
                  <h3 className="admin-card__title">💼 Grille Tarifaire & Facturation</h3>
                  
                  <div className="admin-form-group">
                    <label>Frais de traitement ReWaste (Gate Fee par tonne) :</label>
                    <div className="admin-input-group">
                      <input
                        type="number"
                        value={b2bSettings.gateFeePerTon}
                        onChange={(e) => setB2bSettings(prev => ({ ...prev, gateFeePerTon: parseInt(e.target.value, 10) || 0 }))}
                        className="admin-input"
                      />
                      <span className="admin-input-addon">FCFA / tonne</span>
                    </div>
                    <small>Tarif facturé aux entreprises pour l'accueil de leurs biodéchets.</small>
                  </div>

                  <div className="admin-form-group" style={{ marginTop: '1.25rem' }}>
                    <label>Frais de référence décharge publique locale (ex: Akouédo / Kossihouen) :</label>
                    <div className="admin-input-group">
                      <input
                        type="number"
                        value={b2bSettings.landfillFeePerTon}
                        onChange={(e) => setB2bSettings(prev => ({ ...prev, landfillFeePerTon: parseInt(e.target.value, 10) || 0 }))}
                        className="admin-input"
                      />
                      <span className="admin-input-addon">FCFA / tonne</span>
                    </div>
                    <small>Utilisé pour calculer l'économie nette affichée sur les devis B2B.</small>
                  </div>

                  <div className="admin-form-group" style={{ marginTop: '1.25rem' }}>
                    <label>Facteur d'évitement carbone (tCO2e par tonne valorisée) :</label>
                    <input
                      type="number"
                      step="0.1"
                      value={b2bSettings.carbonFactorPerTon}
                      onChange={(e) => setB2bSettings(prev => ({ ...prev, carbonFactorPerTon: parseFloat(e.target.value) || 0 }))}
                      className="admin-input"
                    />
                    <small>Standard ADEME / GIEC pour la décomposition anaérobie évitée.</small>
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card__title">📜 Certificats Carbone & Conformité RSE</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    Les clients B2B peuvent télécharger un certificat officiel d'impact écologique directement depuis leur espace.
                  </p>
                  
                  <div className="admin-certificate-preview-box">
                    <span className="admin-cert-seal">🌿 CERTIFIÉ REWASTE CI</span>
                    <h4>Certificat d'Impact Carbone Officiel</h4>
                    <p>Format PDF avec signature électronique et QR code d'authenticité.</p>
                    <button
                      className="btn btn--outline btn--sm"
                      onClick={() => {
                        const doc = new jsPDF();
                        doc.setFontSize(20);
                        doc.text("ReWaste BSF - Certificat d'Impact Carbone", 20, 30);
                        doc.setFontSize(12);
                        doc.text("Ce document atteste de la valorisation de biodéchets par bioconversion.", 20, 50);
                        doc.text("Entreprise : Agro-Industrie Partenaire", 20, 60);
                        doc.text("Impact : 15.000 kg valorisés = 22.5 tCO2e évitées", 20, 70);
                        doc.text("Signé : Cyrille & Kouessi Émile Hognikou", 20, 90);
                        doc.save("certificat_carbone_test_rewaste.pdf");
                        showToast("📄 Certificat de test généré !");
                      }}
                    >
                      📥 Télécharger un Certificat d'Exemple
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 5: PÉPINIÈRE & SATELLITES BSF
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === 'satellites' && (
            <div className="admin-pane">
              <div className="admin-pane__header">
                <div>
                  <h2 className="admin-pane__title">Suivi de la Pépinière & Fermes Satellites</h2>
                  <p className="admin-pane__desc">
                    Supervision des lots de larves 5-DOL, Love Cages d'oviposition et performance zootechnique.
                  </p>
                </div>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => showToast('🔬 Données zootechniques actualisées')}
                >
                  🔄 Actualiser les mesures
                </button>
              </div>

              <div className="admin-grid-three">
                <div className="admin-card">
                  <span className="badge badge--leaf">🥚 Nurserie & Reproduction</span>
                  <h3 style={{ marginTop: '0.5rem' }}>Love Cages Actives</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>6 Cages</div>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Ponte moyenne : 42g d'œufs / jour (~1,6 million d'individus potentiels)</p>
                </div>

                <div className="admin-card">
                  <span className="badge badge--amber">🐛 Engraissement 12j</span>
                  <h3 style={{ marginTop: '0.5rem' }}>Lots en Croissance</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#e5a93c' }}>18 Bacs</div>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Taux de conversion moyen (BCR) : 14.8% sur gisement maraîcher</p>
                </div>

                <div className="admin-card">
                  <span className="badge badge--blue">🛰️ Satellites Affiliés</span>
                  <h3 style={{ marginTop: '0.5rem' }}>Éleveurs Raccordés</h3>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>8 Fermes</div>
                  <p style={{ fontSize: '0.85rem', color: '#666' }}>Alimentées en doses 5-DOL calibrées ReWaste chaque semaine</p>
                </div>
              </div>

              <div className="admin-card" style={{ marginTop: '2rem' }}>
                <h3 className="admin-card__title">📡 Journal des Lots Satellites</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Lot #</th>
                      <th>Localisation</th>
                      <th>Souche</th>
                      <th>Substrat Nourricier</th>
                      <th>Taux Survie</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>LOT-2026-B42</code></td>
                      <td>Pépinière ReWaste (Cocody)</td>
                      <td>Hermetia illucens CI-01</td>
                      <td>Drêches de brasserie + Épluchures manioc</td>
                      <td><strong>94.2%</strong></td>
                      <td><span className="badge badge--leaf">En ponte</span></td>
                    </tr>
                    <tr>
                      <td><code>LOT-2026-S12</code></td>
                      <td>Ferme Satellite Bingerville</td>
                      <td>Hermetia illucens CI-01</td>
                      <td>Fruits de marché + Son de blé</td>
                      <td><strong>89.5%</strong></td>
                      <td><span className="badge badge--amber">Engraissement J8</span></td>
                    </tr>
                    <tr>
                      <td><code>LOT-2026-S13</code></td>
                      <td>Ferme Satellite Grand-Bassam</td>
                      <td>Hermetia illucens CI-01</td>
                      <td>Résidus de poissonnerie + Légumes</td>
                      <td><strong>91.0%</strong></td>
                      <td><span className="badge badge--leaf">Récolte pré-pupes</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              TAB 6: SYSTEM SETTINGS & WAVE CONFIG
             ═════════════════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div className="admin-pane">
              <div className="admin-pane__header">
                <div>
                  <h2 className="admin-pane__title">Paramètres Généraux du Système</h2>
                  <p className="admin-pane__desc">
                    Configuration des paiements Wave CI, coordonnées de Cyrille & Émile et taux de change.
                  </p>
                </div>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => showToast('✅ Paramètres généraux sauvegardés avec succès !')}
                >
                  💾 Enregistrer les réglages
                </button>
              </div>

              <div className="admin-grid-two">
                <div className="admin-card">
                  <h3 className="admin-card__title">💳 Intégration Wave Côte d'Ivoire</h3>
                  <div className="admin-form-group">
                    <label>Numéro Marchand Wave (Réception des paiements) :</label>
                    <input
                      type="text"
                      value={systemSettings.waveMerchantPhone}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, waveMerchantPhone: e.target.value }))}
                      className="admin-input"
                    />
                    <small>Ce numéro est automatiquement intégré dans le QR Code et les boutons de paiement Wave.</small>
                  </div>

                  <div className="admin-form-group" style={{ marginTop: '1.25rem' }}>
                    <label>Email de notification des transactions :</label>
                    <input
                      type="email"
                      value={systemSettings.contactEmail}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card__title">💱 Taux de Change & Devises</h3>
                  
                  <div className="admin-form-group">
                    <label>Taux 1 Dollar US ($ USD) en FCFA :</label>
                    <input
                      type="number"
                      value={systemSettings.exchangeRateUSD}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, exchangeRateUSD: parseInt(e.target.value, 10) || 600 }))}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginTop: '1.25rem' }}>
                    <label>Taux 1 Euro (€ EUR) en FCFA :</label>
                    <input
                      type="number"
                      value={systemSettings.exchangeRateEUR}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, exchangeRateEUR: parseFloat(e.target.value) || 655.957 }))}
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Modal d'Ajout Manuel d'un Stagiaire ── */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-card__header">
              <h3>Inscrire un Stagiaire Manuellement</h3>
              <button className="admin-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddReservation} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Nom complet du participant :</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Yao Koffi"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-grid-two" style={{ gap: '1rem' }}>
                <div className="admin-form-group">
                  <label>Numéro WhatsApp / Téléphone :</label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07 00 00 00 00"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Email :</label>
                  <input
                    type="email"
                    placeholder="email@example.ci"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Formation choisie :</label>
                <select
                  value={newClient.formationTitle}
                  onChange={(e) => {
                    const title = e.target.value;
                    let price = 150000;
                    if (title.includes('1j')) price = 50000;
                    else if (title.includes('2j')) price = 120000;
                    else if (title.includes('3j')) price = 150000;
                    else if (title.includes('5j')) price = 350000;
                    setNewClient({ ...newClient, formationTitle: title, totalFCFA: price * newClient.participants });
                  }}
                  className="admin-input"
                >
                  <option value="Formation Pratique (3j)">Formation Pratique (3j) - 150 000 FCFA</option>
                  <option value="Initiation Express (1j)">Initiation Express (1j) - 50 000 FCFA</option>
                  <option value="Maîtrise de la Reproduction & Nurserie (2j)">Maîtrise Reproduction & Nurserie (2j) - 120 000 FCFA</option>
                  <option value="Formation Business & Pépinière (5j)">Formation Business & Pépinière (5j) - 350 000 FCFA</option>
                </select>
              </div>

              <div className="admin-grid-two" style={{ gap: '1rem' }}>
                <div className="admin-form-group">
                  <label>Nombre de participants :</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={newClient.participants}
                    onChange={(e) => {
                      const count = parseInt(e.target.value, 10) || 1;
                      const unitPrice = newClient.totalFCFA / (newClient.participants || 1);
                      setNewClient({ ...newClient, participants: count, totalFCFA: unitPrice * count });
                    }}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Total à régler ({systemSettings.activeCurrency}) :</label>
                  <input
                    type="number"
                    value={newClient.totalFCFA}
                    onChange={(e) => setNewClient({ ...newClient, totalFCFA: parseInt(e.target.value, 10) || 0 })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-grid-two" style={{ gap: '1rem' }}>
                <div className="admin-form-group">
                  <label>Mode de règlement :</label>
                  <select
                    value={newClient.paymentMethod}
                    onChange={(e) => setNewClient({ ...newClient, paymentMethod: e.target.value })}
                    className="admin-input"
                  >
                    <option value="Wave CI">Wave CI</option>
                    <option value="Espèces sur site">Espèces sur site</option>
                    <option value="Virement bancaire">Virement bancaire</option>
                    <option value="Chèque">Chèque</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Statut :</label>
                  <select
                    value={newClient.status}
                    onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                    className="admin-input"
                  >
                    <option value="Confirmé">Confirmé</option>
                    <option value="En attente">En attente</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Notes / Besoins spécifiques :</label>
                <textarea
                  rows="2"
                  placeholder="ex: Aviculteur 5000 pondeuses..."
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className="admin-input"
                ></textarea>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="btn btn--outline btn--sm" onClick={() => setShowAddModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary btn--sm">
                  ✅ Valider l'inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
