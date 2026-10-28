import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CONTACT } from '../data/siteData';
import './B2BPortal.css';

export default function B2BPortal({ currency = 'FCFA', onCurrencyChange }) {
  // Gate Fees Simulator state
  const [internalCurrency, setInternalCurrency] = useState(currency);
  const activeCurrency = onCurrencyChange ? currency : internalCurrency;

  const [monthlyTonnage, setMonthlyTonnage] = useState(50);
  const [wasteType, setWasteType] = useState('markets'); // 'markets' | 'canteens' | 'brewery'

  // Rates definition (Base FCFA / tonne)
  const ratesFCFA = {
    markets: { label: 'Marchés de gros, fruits & légumes', price: 10000, usd: 16 },
    canteens: { label: 'Restauration collective & cantines', price: 18000, usd: 29 },
    brewery: { label: 'Drêches de brasserie & agro-industries', price: 14000, usd: 23 }
  };

  const selectedRate = ratesFCFA[wasteType];
  const ratePerTon = activeCurrency === 'FCFA' ? selectedRate.price : selectedRate.usd;

  // Gate Fee Calculation
  const monthlyCost = monthlyTonnage * ratePerTon;
  const annualCost = monthlyCost * 12;

  // Traditional landfill cost comparison (standard Abidjan landfill ≈ 25 000 FCFA/t or $40/t)
  const traditionalRate = activeCurrency === 'FCFA' ? 25000 : 40;
  const traditionalCost = monthlyTonnage * traditionalRate;
  const monthlySavings = traditionalCost - monthlyCost;

  // Ecological impact metrics
  const co2AvoidedTonnes = (monthlyTonnage * 0.65).toFixed(1);
  const frassProducedTonnes = (monthlyTonnage * 0.35).toFixed(1);

  // Certificate Generator State
  const [certData, setCertData] = useState({
    companyName: 'Groupe Agro-Industriel Ivoirien',
    facilityLocation: 'Zone Industrielle Yopougon, Abidjan',
    period: '3ème Trimestre 2026',
    tonnage: 120,
    certNumber: `CERT-ENV-2026-${Math.floor(Math.random() * 8999 + 1000)}`
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const certRef = useRef(null);

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificat_ReWaste_${certData.companyName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Erreur génération PDF:', err);
      alert('Erreur lors de la génération du PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const toggleCurrency = (cur) => {
    if (onCurrencyChange) {
      onCurrencyChange(cur);
    } else {
      setInternalCurrency(cur);
    }
  };

  return (
    <div className="b2b-portal">
      {/* ── Header ── */}
      <div className="b2b-portal__header">
        <div className="b2b-portal__pill">
          🏛️ Espace Municipalités & Agro-Industries RSE
        </div>
        <h2 className="b2b-portal__title">
          Portail B2B — Traitement des Biodéchets & Gate Fees
        </h2>
        <p className="b2b-portal__subtitle">
          Solution circulaire certifiée pour les industriels agroalimentaires, municipalités et marchés d'Abidjan.
          Réduction des coûts de décharge, valorisation locale par la mouche soldat noire et attestations RSE officielles.
        </p>

        {/* Currency Switcher */}
        <div className="b2b-currency-switch">
          <span className="b2b-currency-label">Devise de calcul :</span>
          <div className="b2b-currency-buttons">
            <button
              className={`currency-btn ${activeCurrency === 'FCFA' ? 'currency-btn--active' : ''}`}
              onClick={() => toggleCurrency('FCFA')}
            >
              FCFA (Marché Local CI)
            </button>
            <button
              className={`currency-btn ${activeCurrency === 'USD' ? 'currency-btn--active' : ''}`}
              onClick={() => toggleCurrency('USD')}
            >
              USD ($ International)
            </button>
          </div>
          <span className="b2b-currency-info">
            ⚙️ Devise paramétrable depuis le panneau d'administration
          </span>
        </div>
      </div>

      <div className="b2b-layout">
        {/* ── Section 1: Simulateur Gate Fees ── */}
        <div className="b2b-simulator">
          <h3 className="b2b-section-title">
            🧮 Simulateur de Frais de Traitement (Gate Fees)
          </h3>

          <div className="b2b-form-group">
            <label className="b2b-label">
              Typologie des biodéchets à traiter :
            </label>
            <div className="b2b-waste-types">
              {Object.entries(ratesFCFA).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  className={`waste-type-btn ${wasteType === key ? 'waste-type-btn--active' : ''}`}
                  onClick={() => setWasteType(key)}
                >
                  <span className="waste-type-btn__title">{val.label}</span>
                  <span className="waste-type-btn__price">
                    {activeCurrency === 'FCFA' ? `${val.price.toLocaleString()} FCFA / t` : `$${val.usd} / t`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="b2b-form-group">
            <div className="b2b-slider-header">
              <label className="b2b-label">Gisement Mensuel Estimé :</label>
              <strong className="b2b-slider-val">{monthlyTonnage} Tonnes / mois</strong>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={monthlyTonnage}
              onChange={(e) => setMonthlyTonnage(parseInt(e.target.value, 10))}
              className="b2b-slider"
            />
            <div className="b2b-slider-marks">
              <span>5 t</span>
              <span>100 t</span>
              <span>250 t</span>
              <span>500 t</span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="b2b-results">
            <div className="b2b-result-box b2b-result-box--highlight">
              <span className="b2b-result-box__label">Gate Fee Mensuel</span>
              <strong className="b2b-result-box__value">
                {monthlyCost.toLocaleString()} {activeCurrency}
              </strong>
              <span className="b2b-result-box__sub">
                {annualCost.toLocaleString()} {activeCurrency} / an
              </span>
            </div>

            <div className="b2b-result-box b2b-result-box--savings">
              <span className="b2b-result-box__label">Économie vs Décharge Standard</span>
              <strong className="b2b-result-box__value text-success">
                +{monthlySavings.toLocaleString()} {activeCurrency}
              </strong>
              <span className="b2b-result-box__sub">
                Sur la base de 25 000 FCFA/t ($40) en décharge municipale
              </span>
            </div>

            <div className="b2b-result-box">
              <span className="b2b-result-box__label">Gaz à effet de serre évités</span>
              <strong className="b2b-result-box__value text-emerald">
                {co2AvoidedTonnes} t eq CO₂
              </strong>
              <span className="b2b-result-box__sub">
                Évitement de méthane (CH₄)
              </span>
            </div>

            <div className="b2b-result-box">
              <span className="b2b-result-box__label">Frass Bio Régénéré</span>
              <strong className="b2b-result-box__value text-amber">
                {frassProducedTonnes} t / mois
              </strong>
              <span className="b2b-result-box__sub">
                Amendement organique réinjecté
              </span>
            </div>
          </div>

          <div className="b2b-cta-box">
            <a
              href={`https://wa.me/${CONTACT.cyrille.phoneClean}?text=${encodeURIComponent(`Bonjour Cyrille, je souhaite convenir d'une convention B2B pour le traitement de ${monthlyTonnage} tonnes de biodéchets/mois (${selectedRate.label}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp"
            >
              💬 Négocier une Convention B2B sur WhatsApp
            </a>
          </div>
        </div>

        {/* ── Section 2: Générateur de Certificat PDF ── */}
        <div className="b2b-certificate-section">
          <h3 className="b2b-section-title">
            📜 Générateur de Certificat d'Impact RSE (PDF)
          </h3>
          <p className="b2b-desc-small">
            Délivrez à vos auditeurs et partenaires un certificat officiel attestant du détournement de vos déchets vers l'unité centrale de bioconversion ReWaste.
          </p>

          <div className="cert-form">
            <div className="form-group">
              <label>Nom de l'Entreprise ou Collectivité</label>
              <input
                type="text"
                value={certData.companyName}
                onChange={(e) => setCertData({ ...certData, companyName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Période Certifiée</label>
              <input
                type="text"
                value={certData.period}
                onChange={(e) => setCertData({ ...certData, period: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tonnage Déchets Détournés (Tonnes)</label>
              <input
                type="number"
                value={certData.tonnage}
                onChange={(e) => setCertData({ ...certData, tonnage: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Certificate Visual Preview for Export */}
          <div className="cert-preview-wrapper">
            <div className="cert-preview" ref={certRef}>
              <div className="cert-border-outer">
                <div className="cert-border-inner">
                  {/* Certificate Header */}
                  <div className="cert-header">
                    <div className="cert-logo-box">
                      <img src="/images/logo.jpg" alt="ReWaste Logo" className="cert-logo" />
                    </div>
                    <div className="cert-title-block">
                      <span className="cert-republic">RÉPUBLIQUE DE CÔTE D'IVOIRE</span>
                      <h4 className="cert-main-title">CERTIFICAT D'IMPACT ENVIRONNEMENTAL</h4>
                      <span className="cert-standard">BIOCONVERSION INDUSTRIELLE CIRCULAIRE — HERMETIA ILLUCENS</span>
                    </div>
                  </div>

                  <div className="cert-ref-bar">
                    <span>RÉF : <strong>{certData.certNumber}</strong></span>
                    <span>DATE : <strong>{new Date().toLocaleDateString('fr-FR')}</strong></span>
                  </div>

                  {/* Body text */}
                  <div className="cert-body">
                    <p className="cert-statement">
                      La société <strong>ReWaste BSF Côte d'Ivoire</strong> (Unité Centrale de Bioconversion, Le Vallon Cocody 2 Plateaux) certifie par la présente que l'entité :
                    </p>
                    <h3 className="cert-beneficiary">{certData.companyName}</h3>
                    <p className="cert-period">
                      pour la période d'activité : <strong>{certData.period}</strong>
                    </p>
                    <p className="cert-statement">
                      a valorisé et détourné de la mise en décharge urbaine un gisement organique certifié de :
                    </p>

                    {/* Impact KPI Box */}
                    <div className="cert-kpis">
                      <div className="cert-kpi-item">
                        <span className="cert-kpi-num">{certData.tonnage} t</span>
                        <span className="cert-kpi-lbl">Biodéchets Traités</span>
                      </div>
                      <div className="cert-kpi-item cert-kpi-item--accent">
                        <span className="cert-kpi-num">{(certData.tonnage * 0.65).toFixed(1)} t</span>
                        <span className="cert-kpi-lbl">Émissions CO₂ Évitées</span>
                      </div>
                      <div className="cert-kpi-item">
                        <span className="cert-kpi-num">{(certData.tonnage * 0.35).toFixed(1)} t</span>
                        <span className="cert-kpi-lbl">Frass Bio Régénéré</span>
                      </div>
                    </div>

                    <p className="cert-clause">
                      Ce procédé de traitement par larves de mouche soldat noire respecte les standards sanitaires de blanchiment à 90°C (60 sec) et contribue aux Objectifs de Développement Durable (ODD 12 & ODD 13).
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="cert-signatures">
                    <div className="cert-signature-block">
                      <span className="cert-sig-role">Directeur des Opérations</span>
                      <strong className="cert-sig-name">Cyrille</strong>
                      <span className="cert-sig-co">Co-Fondateur ReWaste BSF</span>
                      <div className="cert-signature-seal">✓ Scellé Électronique</div>
                    </div>
                    <div className="cert-signature-block">
                      <span className="cert-sig-role">Expert Technique & Bioconversion</span>
                      <strong className="cert-sig-name">Kouessi Émile Hognikou</strong>
                      <span className="cert-sig-co">Co-Fondateur ReWaste BSF</span>
                      <div className="cert-signature-seal">✓ Scellé Électronique</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cert-download-actions">
            <button
              className="btn btn--primary btn--lg"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              style={{ width: '100%' }}
            >
              {isGeneratingPdf ? '⏳ Génération du PDF en cours...' : '📥 Télécharger le Certificat Officiel (PDF A4)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
