import { useState, useEffect, useRef, useCallback } from 'react';
import jsPDF from 'jspdf';
import WavePaymentModal from './components/WavePaymentModal';
import ColonyManager from './components/ColonyManager';
import B2BPortal from './components/B2BPortal';
import AdminModal from './components/AdminModal';
import AdminDashboard from './components/AdminDashboard';
import VideoIntroSection from './components/VideoIntroSection';
import CourseViewer from './components/CourseViewer';
import TrainingBookingForm from './components/TrainingBookingForm';
import {
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon
} from './components/SocialIcons';
import {
  FloatingSpeedDialLeft,
  FloatingSpeedDialRight
} from './components/NavigationDocks';
import {
  CONTACT, FORMATIONS, PRODUCTS, IMPACT_STATS,
  YOUTUBE_VIDEOS, CURATED_PLAYLISTS, RESOURCES
} from './data/siteData';
import FULL_GLOSSARY from './data/fullGlossary.json';
import './App.css';

/* ── Scroll Reveal Hook ── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Animated Counter ── */
function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * value));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Wave SVG Separator ── */
function WaveSeparator({ fill = '#F9FAF8', flip = false }) {
  return (
    <div className={`wave-separator ${flip ? 'wave-separator--flip' : ''}`}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,40 C240,90 480,0 720,50 C960,100 1200,10 1440,60 L1440,100 L0,100 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/* ── Sophisticated Multi-Layer Wave Transition ── */
function SophisticatedWaveTransition() {
  return (
    <div className="section-transition" aria-hidden="true">
      <svg className="section-transition__svg" viewBox="0 0 1440 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="transGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#58B947" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="transGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#58B947" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path d="M0,35 C320,110 420,-15 740,55 C1060,125 1220,15 1440,65 L1440,140 L0,140 Z" fill="url(#transGrad2)" />
        <path d="M0,65 C260,10 490,115 760,45 C1030,-25 1260,95 1440,55 L1440,140 L0,140 Z" fill="url(#transGrad1)" />
        <path d="M0,90 C360,30 680,130 1020,65 C1220,25 1360,85 1440,75 L1440,140 L0,140 Z" fill="#F4F7F5" />
      </svg>
    </div>
  );
}

/* ── Main App ── */
export default function App() {
  // Navigation View State: 'landing' | 'colony' | 'b2b'
  const [currentView, setCurrentView] = useState('landing');
  const [showColonyInline, setShowColonyInline] = useState(false);
  const [showB2BInline, setShowB2BInline] = useState(false);

  const [waveModal, setWaveModal] = useState({ open: false, amount: 10000, context: '' });
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeVideoCategory, setActiveVideoCategory] = useState('Biologie');
  const [glossarySearch, setGlossarySearch] = useState('');
  const [navScrolled, setNavScrolled] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currency, setCurrency] = useState('FCFA');
  const [adminOpen, setAdminOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Close modal on Escape & lock body scrolling
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setActiveModal(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [activeModal]);

  // BSF Calculator state & scenarios
  const [wasteKg, setWasteKg] = useState(200);
  const [calculatorScenario, setCalculatorScenario] = useState('aviculture');
  const [activeGlossaryCategory, setActiveGlossaryCategory] = useState('Tous');
  const [bookingInitialData, setBookingInitialData] = useState({});

  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hash-based routing (#admin, #colony, #b2b)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') setCurrentView('admin');
      else if (window.location.hash === '#colony') setCurrentView('colony');
      else if (window.location.hash === '#b2b') setCurrentView('b2b');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openWaveModal = useCallback((amount, context) => {
    setWaveModal({ open: true, amount, context });
  }, []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    setShowCart(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  const handleNavigate = (target) => {
    if (target === 'colony-view') {
      setCurrentView('colony');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'b2b-view') {
      setCurrentView('b2b');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'admin-view' || target === 'admin') {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'landing') {
      setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'produits' || target === 'boutique') {
      setActiveModal('boutique');
      setMobileMenu(false);
    } else if (target === 'calculateur' || target === 'simulateur') {
      setActiveModal('simulateur');
      setMobileMenu(false);
    } else if (target === 'mediatheque' || target === 'ressources') {
      setActiveModal('ressources');
      setMobileMenu(false);
    } else if (target === 'glossaire' || target === 'lexique') {
      setActiveModal('lexique');
      setMobileMenu(false);
    } else {
      if (currentView !== 'landing') {
        setCurrentView('landing');
        setTimeout(() => scrollTo(target), 80);
      } else {
        scrollTo(target);
      }
    }
  };

  // BSF Calculator computations
  const larvaeNeeded = Math.round(wasteKg / 21 * 17500);
  const surfaceNeeded = (wasteKg / 31.25).toFixed(1);
  const larvaeProduction = Math.round(wasteKg * 0.22 * 30);
  const frassProduction = Math.round(wasteKg * 0.35 * 30);

  const scenarioConfig = {
    aviculture: {
      id: 'aviculture',
      name: '🐔 Aviculture (Poulets & Pondeuses)',
      sub: 'Substitut Soja & Farine Poisson',
      description: 'Remplace jusqu\'à 50% des tourteaux protéinés dans l\'aliment poulets. Augmente la ponte et renforce les plumes et la cuticule.',
      savings: Math.round(larvaeProduction * 0.45 * 500)
    },
    pisciculture: {
      id: 'pisciculture',
      name: '🐟 Pisciculture (Tilapias & Silures)',
      sub: 'Protéine Animale Digestible',
      description: 'Substitut direct aux farines de poisson importées. Excellente appétence aquacole avec digestibilité supérieure à 85%.',
      savings: Math.round(larvaeProduction * 0.45 * 650)
    },
    porciculture: {
      id: 'porciculture',
      name: '🐷 Porciculture (Sevrage & Rations)',
      sub: 'Acide Laurique Immunostimulant',
      description: 'Barrière antibactérienne naturelle grâce à l\'acide laurique (C12:0) qui protège la flore intestinale des porcelets sans antibiotiques.',
      savings: Math.round(larvaeProduction * 0.45 * 420)
    },
    intrants: {
      id: 'intrants',
      name: '📦 Ferme Satellite d\'Intrants',
      sub: 'Vente 5-DOL & Frass Tamisé',
      description: 'Production spécialisée pour revente locale : lots de larves 5-DOL vivantes et sacs de compost frass organique aux maraîchers de proximité.',
      savings: Math.round((larvaeProduction / 2) * 1200 + frassProduction * 200)
    }
  };

  const activeScenario = scenarioConfig[calculatorScenario] || scenarioConfig.aviculture;
  const feedSavings = activeScenario.savings;

  // 1. Export PDF Business Case
  const handleExportCalculatorPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Header Banner
    doc.setFillColor(27, 77, 62);
    doc.rect(0, 0, 210, 36, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('ReWaste BSF — Étude Préliminaire de Rentabilité', 14, 18);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Simulation générée le ${new Date().toLocaleDateString('fr-FR')} • Pépinière Pilote ReWaste Abidjan`, 14, 26);

    // Section 1
    doc.setTextColor(27, 77, 62);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Paramètres & Hypothèses du Projet', 14, 48);

    doc.setFillColor(245, 249, 246);
    doc.roundedRect(14, 52, 182, 28, 2, 2, 'F');
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`• Gisement Quotidien de Biodéchets : ${wasteKg} kg / jour (${(wasteKg * 30 / 1000).toFixed(1)} tonnes / mois)`, 20, 60);
    doc.text(`• Orientation Stratégique : ${activeScenario.name} (${activeScenario.sub})`, 20, 68);
    doc.text(`• Ratio d'alimentation standard pépinière : 31,25 kg biodéchets / m² / jour`, 20, 76);

    // Section 2: Technical Needs
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 77, 62);
    doc.text('2. Dimensionnement Technique Requis', 14, 90);

    doc.setFillColor(255, 255, 255);
    doc.rect(14, 94, 88, 26, 'S');
    doc.rect(108, 94, 88, 26, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Surface de bacs requise :', 18, 102);
    doc.setFontSize(14);
    doc.setTextColor(229, 169, 60);
    doc.text(`${surfaceNeeded} m²`, 18, 114);

    doc.setFontSize(9);
    doc.setTextColor(27, 77, 62);
    doc.text('Larves 5-DOL à ensemencer :', 112, 102);
    doc.setFontSize(14);
    doc.setTextColor(88, 185, 71);
    doc.text(`${larvaeNeeded.toLocaleString('fr-FR')} / semaine`, 112, 114);

    // Section 3: Monthly Outputs
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 77, 62);
    doc.text('3. Rendements Mensuels Estimés', 14, 132);

    doc.setFillColor(245, 249, 246);
    doc.roundedRect(14, 136, 182, 38, 2, 2, 'F');
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`• Production de Larves Fraîches : ${larvaeProduction.toLocaleString('fr-FR')} kg / mois (Rendement BCR ~ 22%)`, 20, 146);
    doc.text(`• Production de Frass Bio Tamisé : ${frassProduction.toLocaleString('fr-FR')} kg / mois (Amendement NPK 3-2-2)`, 20, 154);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 77, 62);
    doc.text(`• Valeur économique mensuelle estimée : ${feedSavings.toLocaleString('fr-FR')} FCFA / mois`, 20, 165);

    // Recommendations
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 77, 62);
    doc.text('Recommandations & Prochaines Étapes ReWaste :', 14, 186);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const recoLines = doc.splitTextToSize(
      "1. Valider la formule d'humidité de votre gisement (70-80% HR, test du poing) lors d'une session de formation pratique.\n" +
      "2. Commander un premier lot pilote de larves 5-DOL calibrées pour tester l'appétence sur votre cheptel.\n" +
      "3. Intégrer le réseau de fermes satellites ReWaste pour garantir l'approvisionnement en géniteurs et le rachat des surplus.",
      180
    );
    doc.text(recoLines, 14, 194);

    // Contact
    doc.setFillColor(27, 77, 62);
    doc.rect(14, 240, 182, 36, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Contact & Accompagnement Dédié :', 20, 250);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Kouessi Émile Hognikou & Cyrille • Téléphone / WhatsApp : ${CONTACT.cyrille.phone}`, 20, 258);
    doc.text(`Email : ${CONTACT.cyrille.email} • Site : Cocody 2 Plateaux, Abidjan, Côte d'Ivoire`, 20, 266);

    doc.save(`ReWaste_Simulation_BSF_${wasteKg}kg_${calculatorScenario}.pdf`);
  };

  // 2. Add calculated 5-DOL doses to cart
  const handleOrderCalculatedLarvae = () => {
    const doses = Math.max(1, Math.ceil(larvaeNeeded / 10000));
    const prod = PRODUCTS.find(p => p.id === '5dol-10k') || PRODUCTS[0];
    setCart(prev => {
      const existing = prev.find(p => p.id === prod.id);
      if (existing) {
        return prev.map(p => p.id === prod.id ? { ...p, qty: p.qty + doses } : p);
      }
      return [...prev, { ...prod, qty: doses }];
    });
    setShowCart(true);
  };

  // 3. Pre-fill and scroll to training booking
  const handleTransferToBooking = () => {
    setActiveModal(null);
    setBookingInitialData({
      notes: `Simulation BSF : ${wasteKg} kg/jour de biodéchets. Surface estimée : ${surfaceNeeded} m². Besoin hebdomadaire : ${larvaeNeeded.toLocaleString('fr-FR')} 5-DOL. Orientation : ${activeScenario.name}.`,
      profile: calculatorScenario === 'aviculture' ? 'aviculteur' : calculatorScenario === 'pisciculture' ? 'pisciculteur' : 'entrepreneur'
    });
    setTimeout(() => {
      scrollTo('inscription-formation');
    }, 80);
  };

  // 4. WhatsApp discussion with calculated figures
  const handleWhatsAppSimulation = () => {
    const text = `Bonjour Cyrille & Émile ! J'ai effectué une simulation sur le BSF Calculator ReWaste :
• Gisement biodéchets : ${wasteKg} kg/jour
• Orientation : ${activeScenario.name}
• Surface de bacs requise : ${surfaceNeeded} m²
• Besoin en 5-DOL : ${larvaeNeeded.toLocaleString('fr-FR')} larves / semaine
• Production mensuelle : ${larvaeProduction.toLocaleString('fr-FR')} kg larves et ${frassProduction.toLocaleString('fr-FR')} kg frass
• Économie / Revenu mensuel : ${feedSavings.toLocaleString('fr-FR')} FCFA / mois

Pouvez-vous m'accompagner pour lancer cette unité ?`;
    window.open(`https://wa.me/${CONTACT.cyrille.phoneClean}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // 76 Glossary Terms & Categories
  const glossaryCategories = ['Tous', ...new Set(FULL_GLOSSARY.map(g => g.category).filter(Boolean))];
  const filteredGlossary = FULL_GLOSSARY.filter(g => {
    const matchesCat = activeGlossaryCategory === 'Tous' || g.category === activeGlossaryCategory;
    const matchesQuery = !glossarySearch ||
      g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      g.definition.toLowerCase().includes(glossarySearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const videoCategories = [...new Set(YOUTUBE_VIDEOS.map(v => v.category))];

  const whatsappUrl = `https://wa.me/${CONTACT.cyrille.phoneClean}?text=${encodeURIComponent(
    'Bonjour ReWaste ! Je suis intéressé(e) par vos services de bioconversion BSF. Pouvez-vous me donner plus d\'informations ?'
  )}`;

  const boutiqueContent = (
    <>
            <div className="container">
              <div className="section__heading reveal">
                <span className="section__eyebrow">🛒 Boutique & Intrants</span>
                <h2 className="section__title">Intrants Biologiques, Équipements & Bioproduits</h2>
                <p className="section__subtitle">
                  Commandez vos larves 5-DOL calibrées, kits complets et coproduits certifiés ReWaste.
                </p>
              </div>

              <div className="products-grid">
                {PRODUCTS.map((product, i) => (
                  <div key={product.id} className={`product-card reveal reveal--delay-${(i % 4) + 1} ${product.highlight ? 'product-card--highlight' : ''}`}>
                    <div className="product-card__icon">{product.icon}</div>
                    <div className="product-card__category">{product.category}</div>
                    <h3 className="product-card__name">{product.name}</h3>
                    <p className="product-card__desc">{product.description}</p>
                    <div className="product-card__price">
                      <span className="product-card__price-value">{product.priceFCFA}</span>
                      <span className="product-card__price-unit">/ {product.unit}</span>
                    </div>
                    <button className="btn btn--primary btn--sm product-card__add" onClick={() => addToCart(product)}>
                      + Ajouter au panier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
  );

  const calculateurContent = (
    <>
            <div className="container">
              <div className="section__heading reveal">
                <span className="section__eyebrow">🧮 Outil Interactif</span>
                <h2 className="section__title">BSF Calculator</h2>
                <p className="section__subtitle">
                  Estimez vos besoins et votre rentabilité en fonction de votre gisement quotidien de biodéchets.
                </p>
              </div>

              <div className="calculator reveal">
                {/* ── Scenario Selection ── */}
                <div className="calculator__scenario-selector">
                  <span className="calc-scenario-label">🎯 1. Choisissez votre orientation d'élevage :</span>
                  <div className="calc-scenarios">
                    {Object.values(scenarioConfig).map(sc => (
                      <button
                        key={sc.id}
                        type="button"
                        className={`calc-scenario-btn ${calculatorScenario === sc.id ? 'active' : ''}`}
                        onClick={() => setCalculatorScenario(sc.id)}
                      >
                        <strong>{sc.name}</strong>
                        <div style={{ fontSize: '0.74rem', opacity: 0.85 }}>{sc.sub}</div>
                      </button>
                    ))}
                  </div>
                  <div className="calc-scenario-desc">
                    💡 <strong>Impact ciblé :</strong> {activeScenario.description}
                  </div>
                </div>

                {/* ── Waste Slider Input ── */}
                <div className="calculator__input-section">
                  <label className="calculator__label">
                    2. Gisement quotidien de biodéchets disponibles :
                  </label>
                  <div className="calculator__slider-row">
                    <input
                      type="range"
                      min="10"
                      max="5000"
                      step="10"
                      value={wasteKg}
                      onChange={(e) => setWasteKg(Number(e.target.value))}
                      className="calculator__slider"
                    />
                    <div className="calculator__value">
                      <input
                        type="number"
                        value={wasteKg}
                        onChange={(e) => setWasteKg(Number(e.target.value) || 10)}
                        className="calculator__number-input"
                      />
                      <span>kg / jour</span>
                    </div>
                  </div>
                </div>

                {/* ── Results Output ── */}
                <div className="calculator__results">
                  <div className="calculator__result-card">
                    <span className="calculator__result-icon">🐛</span>
                    <span className="calculator__result-value">{larvaeNeeded.toLocaleString('fr-FR')}</span>
                    <span className="calculator__result-label">5-DOL nécessaires / semaine</span>
                    <span className="calculator__result-detail">Ensemencement régulier</span>
                  </div>
                  <div className="calculator__result-card">
                    <span className="calculator__result-icon">📐</span>
                    <span className="calculator__result-value">{surfaceNeeded} m²</span>
                    <span className="calculator__result-label">Surface de bacs requise</span>
                    <span className="calculator__result-detail">Ratio : 31,25 kg/m²/jour</span>
                  </div>
                  <div className="calculator__result-card">
                    <span className="calculator__result-icon">⚖️</span>
                    <span className="calculator__result-value">{larvaeProduction.toLocaleString('fr-FR')} kg</span>
                    <span className="calculator__result-label">Larves fraîches / mois</span>
                    <span className="calculator__result-detail">Rendement bioconversion 22%</span>
                  </div>
                  <div className="calculator__result-card">
                    <span className="calculator__result-icon">🌱</span>
                    <span className="calculator__result-value">{frassProduction.toLocaleString('fr-FR')} kg</span>
                    <span className="calculator__result-label">Frass (engrais bio) / mois</span>
                    <span className="calculator__result-detail">Amendement NPK 3-2-2 stabilisé</span>
                  </div>
                  <div className="calculator__result-card calculator__result-card--highlight">
                    <span className="calculator__result-icon">💰</span>
                    <span className="calculator__result-value">{feedSavings.toLocaleString('fr-FR')} FCFA</span>
                    <span className="calculator__result-label">Gain / Économie mensuelle estimée</span>
                    <span className="calculator__result-detail">Scénario : {activeScenario.name}</span>
                  </div>
                </div>

                {/* ── 4 Action Buttons ── */}
                <div className="calculator__actions-grid">
                  <button 
                    className="calc-action-btn calc-action-btn--pdf"
                    onClick={handleExportCalculatorPDF}
                    title="Télécharger l'étude de rentabilité au format PDF officiel"
                  >
                    📄 Télécharger le Rapport PDF (Rentabilité)
                  </button>

                  <button 
                    className="calc-action-btn calc-action-btn--cart"
                    onClick={handleOrderCalculatedLarvae}
                    title="Ajouter automatiquement les doses 5-DOL nécessaires au panier"
                  >
                    🛒 Commander les 5-DOL ({Math.max(1, Math.ceil(larvaeNeeded / 10000))} dose{Math.ceil(larvaeNeeded / 10000) > 1 ? 's' : ''} de 10k)
                  </button>

                  <button 
                    className="calc-action-btn calc-action-btn--training"
                    onClick={handleTransferToBooking}
                    title="Transférer ces données dans le formulaire d'inscription"
                  >
                    📅 Valider en Formation Pratique
                  </button>

                  <button 
                    className="calc-action-btn calc-action-btn--whatsapp"
                    onClick={handleWhatsAppSimulation}
                    title="Discuter directement de cette simulation avec Cyrille & Émile sur WhatsApp"
                  >
                    📲 Discuter du Projet sur WhatsApp →
                  </button>
                </div>
              </div>
            </div>
          </>
  );

  const mediathequeContent = (
    <>
            <div className="container">
              <div className="section__heading reveal">
                <span className="section__eyebrow">📚 Médiathèque & Ressources</span>
                <h2 className="section__title">18 Vidéos & Bibliothèque Technique FiBL/EAWAG</h2>
                <p className="section__subtitle">
                  Tous les supports officiels, fiches d'élevage et tutoriels vidéo en accès libre.
                </p>
              </div>

              {/* Playlists Thématiques Officielles */}
              <div className="playlists-section reveal">
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
                  <span className="badge badge--leaf">🎬 Sélections & Retours Terrain</span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--color-primary)' }}>
                    Playlists Thématiques Vidéo & Références Officielles
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '650px', margin: '0 auto' }}>
                    Des parcours complets pour approfondir chaque étape : vidéos de terrain ReWaste, protocoles de recherche Eawag/Sandec et retours d'éleveurs.
                  </p>
                </div>

                <div className="playlists-grid">
                  {CURATED_PLAYLISTS.map((pl) => (
                    <a
                      key={pl.id}
                      href={pl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="playlist-card"
                      title={`Voir la playlist ${pl.title}`}
                    >
                      <div>
                        <div className="playlist-card__header">
                          <div className="playlist-card__icon-badge">
                            <span>{pl.icon}</span>
                            <span className="badge badge--leaf" style={{ fontSize: '0.72rem' }}>{pl.badge}</span>
                          </div>
                          <span className="playlist-card__count">▶ {pl.videoCount}</span>
                        </div>
                        <h4 className="playlist-card__title">{pl.title}</h4>
                        <div className="playlist-card__author">👤 {pl.author}</div>
                        <p className="playlist-card__desc">{pl.description}</p>
                      </div>

                      <div className="playlist-card__footer">
                        <span>Ouvrir la playlist complète</span>
                        <span>↗</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="section__heading reveal" style={{ marginTop: 'var(--space-3xl)', marginBottom: 'var(--space-lg)' }}>
                <span className="section__eyebrow">📺 Tutoriels Détaillés par Stade</span>
                <h3 className="section__title" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>
                  16 Vidéos Pratiques de l'Insecte au Produit Fini
                </h3>
              </div>

              {/* Video Category Tabs */}
              <div className="media-tabs reveal">
                {videoCategories.map(cat => (
                  <button
                    key={cat}
                    className={`media-tab ${activeVideoCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveVideoCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Videos Grid */}
              <div className="videos-grid reveal">
                {YOUTUBE_VIDEOS.filter(v => v.category === activeVideoCategory).map(video => (
                  <div key={video.id} className="video-card">
                    <div className="video-card__embed">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                    <h4 className="video-card__title">{video.title}</h4>
                  </div>
                ))}
              </div>

              {/* Resources Grid */}
              <div className="section__heading reveal" style={{ marginTop: 'var(--space-4xl)' }}>
                <span className="section__eyebrow">📥 Téléchargements Officiels</span>
                <h3 className="section__title" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                  Bibliothèque Technique EAWAG / Sandec / FiBL
                </h3>
              </div>

              <div className="resources-grid reveal">
                {RESOURCES.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-card"
                  >
                    <span className="resource-card__icon">{res.icon}</span>
                    <span className="resource-card__title">{res.title}</span>
                    <span className="resource-card__dl">↓ Télécharger</span>
                  </a>
                ))}
              </div>
            </div>
          </>
  );

  const glossaireContent = (
    <>
            <div className="container container--narrow">
              <div className="section__heading reveal">
                <span className="section__eyebrow">📖 Glossaire & Lexique</span>
                <h2 className="section__title">Lexique Scientifique & Opérationnel BSF</h2>
                <p className="section__subtitle">
                  Tous les termes clés pour maîtriser le vocabulaire de la bioconversion par insectes.
                </p>
              </div>

              <div className="glossary reveal">
                <div className="glossary__search">
                  <span className="glossary__search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Rechercher parmi les 76 termes (ex: BCR, Frass, 5-DOL, Love Cage, Oviposition...)"
                    value={glossarySearch}
                    onChange={(e) => setGlossarySearch(e.target.value)}
                    className="glossary__search-input"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="glossary__categories">
                  {glossaryCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`glossary-cat-pill ${activeGlossaryCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveGlossaryCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="glossary__count-bar">
                  <span>Affichage de <strong>{filteredGlossary.length}</strong> sur <strong>{FULL_GLOSSARY.length}</strong> termes répertoriés</span>
                  {activeGlossaryCategory !== 'Tous' && (
                    <span>Catégorie : <strong>{activeGlossaryCategory}</strong></span>
                  )}
                </div>

                <div className="glossary__list">
                  {filteredGlossary.map((item, i) => (
                    <details key={i} className="glossary__item">
                      <summary className="glossary__term">
                        <span>{item.term}</span>
                        {item.category && <span className="glossary__cat-tag">{item.category}</span>}
                      </summary>
                      <p className="glossary__definition">{item.definition}</p>
                    </details>
                  ))}
                  {filteredGlossary.length === 0 && (
                    <p className="glossary__empty">Aucun terme trouvé pour « {glossarySearch} »</p>
                  )}
                </div>
              </div>
            </div>
          </>
  );

  return (
    <div className="app">
      {/* ═══ NAVBAR (Universal) ═══ */}
      {currentView !== 'admin' && (
        <nav className={`navbar ${navScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          <div className="navbar__brand" onClick={() => handleNavigate('landing')}>
            <img src="/images/logo.jpg" alt="ReWaste BSF" className="navbar__logo" />
            <div>
              <span className="navbar__name">ReWaste</span>
              <span className="navbar__tagline">Bioconversion BSF</span>
            </div>
          </div>

          <div className={`navbar__links ${mobileMenu ? 'active' : ''}`}>
            <button onClick={() => handleNavigate('formations')}>Formations</button>
            <button onClick={() => handleNavigate('produits')}>Boutique</button>
            <button onClick={() => handleNavigate('calculateur')}>Calculateur</button>
            <button 
              onClick={() => handleNavigate('colony-view')}
              className={`nav-special-btn ${currentView === 'colony' ? 'active-special' : ''}`}
            >
              🐛 Colony SaaS
            </button>
            <button 
              onClick={() => handleNavigate('b2b-view')}
              className={`nav-special-btn ${currentView === 'b2b' ? 'active-special' : ''}`}
            >
              🏢 Portail B2B
            </button>
            <button onClick={() => handleNavigate('mediatheque')}>Médiathèque</button>
            <button onClick={() => handleNavigate('glossaire')}>Glossaire</button>
            <button onClick={() => handleNavigate('contact')}>Contact</button>
          </div>

          <div className="navbar__actions">
            {cart.length > 0 && (
              <button className="navbar__cart" onClick={() => setShowCart(!showCart)}>
                🛒 <span className="navbar__cart-count">{cart.length}</span>
              </button>
            )}
            <button className="btn btn--accent btn--sm" onClick={() => openWaveModal(10000, '')}>
              💳 Payer via Wave
            </button>
            <button
              className="btn btn--secondary btn--sm admin-nav-btn"
              onClick={() => handleNavigate('admin-view')}
              title="Panneau d'administration Cyrille & Émile"
            >
              ⚙️ Admin
            </button>
            <button className="navbar__burger" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {/* Mini Cart Dropdown */}
        {showCart && cart.length > 0 && (
          <div className="mini-cart">
            <div className="mini-cart__header">
              <h4>Votre panier</h4>
              <button onClick={() => setShowCart(false)}>✕</button>
            </div>
            {cart.map(item => (
              <div key={item.id} className="mini-cart__item">
                <span>{item.icon} {item.name} × {item.qty}</span>
                <div className="mini-cart__item-actions">
                  <span>{(item.price * item.qty).toLocaleString('fr-FR')} F</span>
                  <button onClick={() => removeFromCart(item.id)}>🗑</button>
                </div>
              </div>
            ))}
            <div className="mini-cart__total">
              <strong>Total : {cartTotal.toLocaleString('fr-FR')} FCFA</strong>
            </div>
            <div className="mini-cart__actions">
              <button
                className="btn btn--wave btn--sm"
                onClick={() => openWaveModal(cartTotal, 'Commande Boutique ReWaste')}
              >
                Payer {cartTotal.toLocaleString('fr-FR')} F via Wave
              </button>
              <a
                href={`https://wa.me/${CONTACT.cyrille.phoneClean}?text=${encodeURIComponent(
                  `Bonjour ! Je souhaite commander :\n${cart.map(i => `• ${i.name} × ${i.qty}`).join('\n')}\nTotal : ${cartTotal.toLocaleString('fr-FR')} FCFA`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp btn--sm"
              >
                Commander via WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 1: STANDALONE COLONY MANAGER SAAS
         ══════════════════════════════════════════════════════════════════ */}
      {currentView === 'colony' && (
        <div className="standalone-page">
          <header className="standalone-header">
            <div className="container standalone-header__inner">
              <button className="standalone-back-btn" onClick={() => handleNavigate('landing')}>
                ← Revenir au site vitrine
              </button>
              <div className="standalone-header__title">
                <span className="badge badge--leaf">Système d'Exploitation Pépinière</span>
                <h2>🐛 Colony Manager SaaS</h2>
              </div>
              <div className="standalone-header__actions">
                <span className="standalone-status-tag">
                  <span className="dot-pulse"></span> Mode Hors-Ligne (Dexie.js)
                </span>
                <button className="btn btn--accent btn--sm" onClick={() => openWaveModal(10000, 'Abonnement SaaS Colony Manager')}>
                  💳 Wave Pay
                </button>
                <button className="btn btn--secondary btn--sm" onClick={() => handleNavigate('admin-view')}>
                  ⚙️ Admin
                </button>
              </div>
            </div>
          </header>

          <main className="standalone-main">
            <div className="container">
              <ColonyManager />
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 2: STANDALONE B2B ENTERPRISE & GATE FEES PORTAL
         ══════════════════════════════════════════════════════════════════ */}
      {currentView === 'b2b' && (
        <div className="standalone-page">
          <header className="standalone-header standalone-header--b2b">
            <div className="container standalone-header__inner">
              <button className="standalone-back-btn" onClick={() => handleNavigate('landing')}>
                ← Revenir au site vitrine
              </button>
              <div className="standalone-header__title">
                <span className="badge badge--amber">Espace Municipal & Agro-Industrie</span>
                <h2>🏢 Portail B2B & Traçabilité RSE</h2>
              </div>
              <div className="standalone-header__actions">
                <div className="standalone-currency-toggle">
                  <span>Devise :</span>
                  <button 
                    className={`curr-pill ${currency === 'FCFA' ? 'active' : ''}`}
                    onClick={() => setCurrency('FCFA')}
                  >
                    FCFA
                  </button>
                  <button 
                    className={`curr-pill ${currency === 'USD' ? 'active' : ''}`}
                    onClick={() => setCurrency('USD')}
                  >
                    USD ($)
                  </button>
                </div>
                <button className="btn btn--secondary btn--sm" onClick={() => handleNavigate('admin-view')}>
                  ⚙️ Admin
                </button>
              </div>
            </div>
          </header>

          <main className="standalone-main">
            <div className="container">
              <B2BPortal currency={currency} onCurrencyChange={setCurrency} />
            </div>
          </main>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 3: STANDALONE DEDICATED ADMIN BACK-OFFICE
         ══════════════════════════════════════════════════════════════════ */}
      {currentView === 'admin' && (
        <AdminDashboard
          onNavigateHome={() => handleNavigate('landing')}
          currency={currency}
          onCurrencyChange={setCurrency}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 3: MAIN LANDING PAGE
         ══════════════════════════════════════════════════════════════════ */}
      {currentView === 'landing' && (
        <>
          {/* ═══ HERO SECTION ═══ */}
          <section id="hero" className="hero">
            <div className="hero__bg">
              <img src="/images/hero.jpg" alt="" className="hero__bg-img" />
              <div className="hero__overlay"></div>
            </div>
            <div className="container hero__content">
              <div className="hero__badges">
                <span className="badge badge--leaf">🐛 Bioconversion BSF</span>
                <span className="badge badge--amber">🇨🇮 Cocody, Abidjan</span>
              </div>
              <h1 className="hero__title">
                Transformez vos <span className="hero__highlight">biodéchets</span> en
                <span className="hero__highlight"> ressources précieuses</span>
              </h1>
              <p className="hero__subtitle">
                Formation, équipements et accompagnement pour la bioconversion par larves
                de mouche soldat noire (<em>Hermetia illucens</em>). Jusqu'à 80% de réduction
                des déchets organiques.
              </p>
              <div className="hero__cta">
                <button className="btn btn--accent btn--lg" onClick={() => scrollTo('formations')}>
                  🎓 Découvrir nos formations →
                </button>
                <button className="btn btn--outline btn--lg hero__btn-outline" onClick={() => setActiveModal('simulateur')}>
                  🧮 Simuler mon projet
                </button>
              </div>
            </div>

            {/* Impact Stats Bar */}
            <div className="hero__stats">
              <div className="container">
                <div className="hero__stats-grid">
                  {IMPACT_STATS.map((stat, i) => (
                    <div key={i} className="hero__stat">
                      <span className="hero__stat-icon">{stat.icon}</span>
                      <span className="hero__stat-value">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </span>
                      <span className="hero__stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Social Proof / Community Bar */}
            <div className="hero__socials reveal">
              <div className="container">
                <div className="hero__socials-card">
                  <div className="hero__socials-info">
                    <div className="hero__socials-badge">
                      <span className="pulse-dot"></span>
                      Communauté ReWaste BSF
                    </div>
                    <p className="hero__socials-tagline">
                      Rejoignez <strong>+10 000 éleveurs & pionniers</strong> en direct sur nos réseaux :
                    </p>
                  </div>

                  <div className="hero__socials-buttons">
                    <a 
                      href={CONTACT.socials.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-pill social-pill--tiktok"
                      title="TikTok @plantzilla4"
                    >
                      <div className="social-pill__icon"><TikTokIcon size={18} /></div>
                      <div className="social-pill__text">
                        <span className="social-pill__platform">TikTok</span>
                        <span className="social-pill__handle">@plantzilla4</span>
                      </div>
                      <span className="social-pill__arrow">↗</span>
                    </a>

                    <a 
                      href={CONTACT.socials.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-pill social-pill--youtube"
                      title="Chaîne YouTube Kouessi Émile Hognikou"
                    >
                      <div className="social-pill__icon"><YouTubeIcon size={18} /></div>
                      <div className="social-pill__text">
                        <span className="social-pill__platform">YouTube</span>
                        <span className="social-pill__handle">18 Tutoriels</span>
                      </div>
                      <span className="social-pill__arrow">↗</span>
                    </a>

                    <a 
                      href={CONTACT.socials.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="social-pill social-pill--facebook"
                      title="Page Facebook ReWaste"
                    >
                      <div className="social-pill__icon"><FacebookIcon size={18} /></div>
                      <div className="social-pill__text">
                        <span className="social-pill__platform">Facebook</span>
                        <span className="social-pill__handle">Page Officielle</span>
                      </div>
                      <span className="social-pill__arrow">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ PRÉSENTATION VIDÉO OFFICIELLE & VISITE PÉPINIÈRE ═══ */}
          <VideoIntroSection />

          {/* ═══ SOPHISTICATED WAVE TRANSITION ═══ */}
          <SophisticatedWaveTransition />

          {/* ═══ FORMATIONS SECTION ═══ */}
          <section id="formations" className="section section--formations">
            <div className="container">
              <div className="section__heading reveal">
                <span className="section__eyebrow">🎓 Formations & Masterclasses</span>
                <h2 className="section__title">Maîtrisez l'Élevage BSF en Immersion</h2>
                <p className="section__subtitle">
                  Des programmes intensifs de 1 à 5 jours, limités à 12 participants par session,
                  pour une transmission d'excellence à Cocody 2 Plateaux, Abidjan.
                </p>
              </div>

              {/* ─── INFOGRAPHIE & PARCOURS PÉDAGOGIQUE ─── */}
              <div className="formations-infographic reveal">
                {/* Photo & Highlights Card */}
                <div className="formations-infographic__hero">
                  <div className="formations-infographic__photo-box">
                    <img 
                      src="/images/training_masterclass.jpg" 
                      alt="Formation pratique BSF à Abidjan" 
                      className="formations-infographic__photo"
                    />
                    <div className="formations-infographic__photo-badge">
                      <span className="badge-pulse"></span>
                      📍 Pépinière Pilote • Cocody, Abidjan
                    </div>
                  </div>

                  <div className="formations-infographic__intro">
                    <span className="badge badge--leaf">🔬 Méthode Éprouvée ReWaste</span>
                    <h3 className="formations-infographic__title">
                      Devenez autonome et rentable en conditions réelles d'exploitation
                    </h3>
                    <p className="formations-infographic__text">
                      Nos formations ne sont pas de simples cours magistraux. Vous manipulez directement dans nos serres de reproduction, préparez les rations et opérez les tamisages aux côtés de <strong>Cyrille</strong> et <strong>Kouessi Émile</strong>.
                    </p>

                    {/* 4 Piliers Chiffrés */}
                    <div className="formations-pillars-grid">
                      <div className="pillar-item">
                        <div className="pillar-item__num">80%</div>
                        <div className="pillar-item__label">Pratique Terrain</div>
                        <div className="pillar-item__sub">En immersion sur site</div>
                      </div>
                      <div className="pillar-item">
                        <div className="pillar-item__num">12 max</div>
                        <div className="pillar-item__label">Participants / Session</div>
                        <div className="pillar-item__sub">Encadrement sur-mesure</div>
                      </div>
                      <div className="pillar-item">
                        <div className="pillar-item__num">100%</div>
                        <div className="pillar-item__label">Kit & Fiches Inclus</div>
                        <div className="pillar-item__sub">Géniteurs & manuels officiels</div>
                      </div>
                      <div className="pillar-item">
                        <div className="pillar-item__num">À vie</div>
                        <div className="pillar-item__label">Suivi WhatsApp Pro</div>
                        <div className="pillar-item__sub">Rachat prioritaire larves</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Steps Interactive Learning Journey */}
                <div className="formations-journey">
                  <div className="formations-journey__heading">
                    <h4>Le Parcours Maîtrise en 4 Étapes Clés</h4>
                    <p>Un apprentissage chronologique conçu pour lancer et rentabiliser votre unité dès le 1er mois</p>
                  </div>

                  <div className="journey-steps">
                    <div className="journey-step">
                      <div className="journey-step__header">
                        <span className="journey-step__badge">Étape 01</span>
                        <span className="journey-step__icon">🔬</span>
                      </div>
                      <h5>Biologie & Nurserie</h5>
                      <p>Love Cages, spectres lumineux 440/540 nm, incubation des pontes et gestion des 5-DOL calibrées.</p>
                      <span className="journey-step__kpi">Taux éclosion &gt; 85%</span>
                    </div>

                    <div className="journey-step">
                      <div className="journey-step__header">
                        <span className="journey-step__badge">Étape 02</span>
                        <span className="journey-step__icon">🥗</span>
                      </div>
                      <h5>Formulation Substrats</h5>
                      <p>Recettes biodéchets locaux (fruits, brasserie), rapport C/N, formule nurserie 70/30 provende/eau.</p>
                      <span className="journey-step__kpi">Test du poing 70-80%</span>
                    </div>

                    <div className="journey-step">
                      <div className="journey-step__header">
                        <span className="journey-step__badge">Étape 03</span>
                        <span className="journey-step__icon">⚡</span>
                      </div>
                      <h5>Engraissement & Tri</h5>
                      <p>Conduite des Larveros, densité 31,25 kg/m²/j, cycle 12 jours et séparation mécanique par tamis vibrant.</p>
                      <span className="journey-step__kpi">BCR cible &gt; 12%</span>
                    </div>

                    <div className="journey-step">
                      <div className="journey-step__header">
                        <span className="journey-step__badge">Étape 04</span>
                        <span className="journey-step__icon">💎</span>
                      </div>
                      <h5>Post-Traitement & Vente</h5>
                      <p>Blanchiment sécurisé 90°C/60s, séchage Pop-Larvae au micro-ondes, extraction huile et frass organique.</p>
                      <span className="journey-step__kpi">Marge brute &gt; 45%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="formations-grid">
                {FORMATIONS.map((formation, i) => (
                  <div key={formation.id} className={`formation-card formation-card--${formation.color} reveal reveal--delay-${i + 1}`}>
                    {formation.popular && <div className="formation-card__ribbon">⭐ Le plus populaire</div>}
                    <div className="formation-card__header">
                      <span className="formation-card__icon">{formation.icon}</span>
                      <span className={`badge badge--${formation.color}`}>{formation.badge}</span>
                    </div>
                    <h3 className="formation-card__title">{formation.title}</h3>
                    <p className="formation-card__subtitle">{formation.subtitle}</p>
                    <div className="formation-card__meta">
                      <span>⏱ {formation.duration}</span>
                      <span>👥 Max {formation.maxParticipants} places</span>
                    </div>
                    <div className="formation-card__price">
                      <span className="formation-card__price-value">{formation.priceFCFA}</span>
                      <span className="formation-card__price-label">par participant</span>
                    </div>
                    <ul className="formation-card__features">
                      {formation.features.map((f, j) => (
                        <li key={j}><span className="formation-card__check">✓</span> {f}</li>
                      ))}
                    </ul>
                    <div className="formation-card__actions">
                      <button
                        className={`btn ${formation.popular ? 'btn--primary' : 'btn--outline'} formation-card__btn`}
                        onClick={() => openWaveModal(formation.price, `${formation.title} — ${formation.duration}`)}
                      >
                        💳 Réserver via Wave
                      </button>
                      <a
                        href={`https://wa.me/${CONTACT.cyrille.phoneClean}?text=${encodeURIComponent(
                          `Bonjour ! Je souhaite m'inscrire à la ${formation.title} (${formation.duration}). Merci de me confirmer les prochaines dates disponibles.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--whatsapp formation-card__btn"
                      >
                        📱 Réserver via WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── SUPPORT DE COURS & PÉDAGOGIE OFFICIELLE (4 CHAPITRES LMS) ─── */}
              <CourseViewer />

              {/* ─── FORMULAIRE D'INSCRIPTION & PRISE DE RENDEZ-VOUS ─── */}
              <TrainingBookingForm onOpenWave={openWaveModal} initialData={bookingInitialData} />
            </div>
          </section>

          <WaveSeparator fill="#F9FAF8" flip={true} />

          {/* ═══ COLONY MANAGER SHOWCASE SECTION ═══ */}
          <section id="colony" className="section section--alt">
            <div className="container">
              <div className="saas-showcase-card reveal">
                <div className="saas-showcase-card__content">
                  <span className="badge badge--leaf">🐛 Logiciel Métier Satellites</span>
                  <h3 className="saas-showcase-card__title">SaaS Colony Manager</h3>
                  <p className="saas-showcase-card__desc">
                    L'application métier dédiée à la conduite de vos lots d'élevage, au calcul automatique du BCR (&gt;12%), du taux de survie larvaire et de la réduction de matière sèche (WWR). Fonctionne 100% hors-ligne dans vos serres.
                  </p>
                  
                  <div className="saas-showcase-features">
                    <div className="saas-feat">⚡ Mode Local-First (Dexie.js)</div>
                    <div className="saas-feat">📊 Alertes prédictives & BCR</div>
                    <div className="saas-feat">🔄 Traçabilité du Cycle 12 jours</div>
                  </div>

                  <div className="saas-showcase-actions">
                    <button 
                      className="btn btn--primary btn--lg"
                      onClick={() => handleNavigate('colony-view')}
                    >
                      🚀 Lancer l'Application Colony Manager (Plein Écran) →
                    </button>
                    <button 
                      className="btn btn--outline btn--lg"
                      onClick={() => setShowColonyInline(!showColonyInline)}
                    >
                      {showColonyInline ? '▲ Masquer l\'aperçu direct' : '👁️ Aperçu direct sur cette page'}
                    </button>
                  </div>
                </div>
              </div>

              {showColonyInline && (
                <div className="inline-app-wrapper reveal" style={{ marginTop: '2rem' }}>
                  <ColonyManager />
                </div>
              )}
            </div>
          </section>

          <WaveSeparator fill="#FFFFFF" />

          {/* ═══ PORTAIL B2B SHOWCASE SECTION ═══ */}
          <section id="b2b" className="section">
            <div className="container">
              <div className="saas-showcase-card saas-showcase-card--b2b reveal">
                <div className="saas-showcase-card__content">
                  <span className="badge badge--amber">🏢 Espace Collectivités & Industriels</span>
                  <h3 className="saas-showcase-card__title">Portail B2B & Frais de Traitement (Gate Fees)</h3>
                  <p className="saas-showcase-card__desc">
                    Plateforme dédiée aux municipalités et aux agro-industries pour simuler leurs économies de décharge, programmer l'apport de biodéchets et éditer instantanément des <strong>Certificats d'Impact Carbone Officiels ReWaste (PDF)</strong> pour leurs bilans RSE.
                  </p>

                  <div className="saas-showcase-features">
                    <div className="saas-feat">🌱 Certificats de Traçabilité PDF signés</div>
                    <div className="saas-feat">💵 Tarifs configurables FCFA / USD ($)</div>
                    <div className="saas-feat">📉 Économies directes vs décharge publique</div>
                  </div>

                  <div className="saas-showcase-actions">
                    <button 
                      className="btn btn--accent btn--lg"
                      onClick={() => handleNavigate('b2b-view')}
                    >
                      🏢 Accéder au Portail B2B & Simulateur Gate Fees (Plein Écran) →
                    </button>
                    <button 
                      className="btn btn--outline btn--lg"
                      onClick={() => setShowB2BInline(!showB2BInline)}
                    >
                      {showB2BInline ? '▲ Masquer l\'aperçu direct' : '👁️ Aperçu direct sur cette page'}
                    </button>
                  </div>
                </div>
              </div>

              {showB2BInline && (
                <div className="inline-app-wrapper reveal" style={{ marginTop: '2rem' }}>
                  <B2BPortal currency={currency} onCurrencyChange={setCurrency} />
                </div>
              )}
            </div>
          </section>

          <WaveSeparator fill="#0D2B21" />

          {/* ═══ CONTACT / FOOTER ═══ */}
          <footer id="contact" className="footer">
            <div className="container">
              <div className="footer__grid">
                <div className="footer__brand">
                  <img src="/images/logo.jpg" alt="ReWaste" className="footer__logo" />
                  <h3 className="footer__name">ReWaste BSF</h3>
                  <p className="footer__desc">
                    Écosystème de Valorisation — Pépinière BSF & Partenaires de Traitement.
                    Abidjan, Côte d'Ivoire.
                  </p>
                  
                  {/* Footer Socials with Authentic SVG Icons */}
                  <div className="footer__socials">
                    <a 
                      href={CONTACT.socials.tiktok} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="TikTok (@plantzilla4)"
                      className="footer-social-btn footer-social-btn--tiktok"
                    >
                      <TikTokIcon size={18} />
                    </a>
                    <a 
                      href={CONTACT.socials.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="YouTube (ReWaste BSF)"
                      className="footer-social-btn footer-social-btn--youtube"
                    >
                      <YouTubeIcon size={18} />
                    </a>
                    <a 
                      href={CONTACT.socials.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Facebook (ReWaste BSF Officiel)"
                      className="footer-social-btn footer-social-btn--facebook"
                    >
                      <FacebookIcon size={18} />
                    </a>
                  </div>
                </div>

                <div className="footer__section">
                  <h4>Contact</h4>
                  <p>📧 <a href={`mailto:${CONTACT.cyrille.email}`}>{CONTACT.cyrille.email}</a></p>
                  <p>📞 <a href={`tel:${CONTACT.cyrille.phoneClean}`}>{CONTACT.cyrille.phone}</a></p>
                  <p>📍 {CONTACT.address}</p>
                </div>

                <div className="footer__section">
                  <h4>Navigation Directe</h4>
                  <button onClick={() => scrollTo('formations')}>Formations</button>
                  <button onClick={() => setActiveModal('boutique')}>Boutique</button>
                  <button onClick={() => setActiveModal('simulateur')}>BSF Calculator</button>
                  <button onClick={() => handleNavigate('colony-view')}>🐛 SaaS Colony Manager</button>
                  <button onClick={() => handleNavigate('b2b-view')}>🏢 Portail B2B & Gate Fees</button>
                  <button onClick={() => setActiveModal('ressources')}>Médiathèque</button>
                  <button onClick={() => setActiveModal('lexique')}>Glossaire</button>
                  <button onClick={() => handleNavigate('admin-view')} style={{ color: 'var(--color-amber)', fontWeight: 'bold' }}>
                    🔐 Espace Administrateur
                  </button>
                </div>

                <div className="footer__section">
                  <h4>Paiement & Contact Rapide</h4>
                  <button className="btn btn--wave btn--sm" onClick={() => openWaveModal(10000, '')} style={{ marginBottom: '0.5rem', width: '100%' }}>
                    💳 Payer via Wave
                  </button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--sm" style={{ width: '100%' }}>
                    📱 Contacter sur WhatsApp
                  </a>
                </div>
              </div>

              <div className="footer__bottom">
                <p>© {new Date().getFullYear()} ReWaste BSF — Tous droits réservés.</p>
                <p>Co-fondé par Cyrille & Kouessi Émile Hognikou</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ═══ FLOATING DOCK BOTTOM-LEFT (Accès Rapide) ═══ */}
      {currentView !== 'admin' && <FloatingSpeedDialLeft onOpenModal={setActiveModal} />}

      {/* ═══ FLOATING SPEED-DIAL BOTTOM-RIGHT (Socials & Direct Contacts) ═══ */}
      {currentView !== 'admin' && <FloatingSpeedDialRight whatsappUrl={whatsappUrl} phoneClean={CONTACT.cyrille.phoneClean} />}

      {/* ═══ WAVE PAYMENT MODAL ═══ */}
      <WavePaymentModal
        isOpen={waveModal.open}
        onClose={() => setWaveModal(prev => ({ ...prev, open: false }))}
        context={waveModal.context}
        defaultAmount={waveModal.amount}
      />

      {/* ═══ ADMIN DASHBOARD MODAL ═══ */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* ═══ QUICK ACCESS MODAL ═══ */}
      {activeModal && (
        <div className="qa-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="qa-modal-content" onClick={e => e.stopPropagation()}>
            <button className="qa-modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <div className="qa-modal-body">
              {activeModal === 'boutique' && boutiqueContent}
              {activeModal === 'simulateur' && calculateurContent}
              {activeModal === 'ressources' && mediathequeContent}
              {activeModal === 'lexique' && glossaireContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
