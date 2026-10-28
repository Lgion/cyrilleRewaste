import { useState } from 'react';
import { CONTACT, FORMATIONS } from '../data/siteData';
import './TrainingBookingForm.css';

export default function TrainingBookingForm({ onOpenWave, initialData = {} }) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    whatsapp: initialData.whatsapp || '',
    email: initialData.email || '',
    city: initialData.city || 'Abidjan',
    formationId: initialData.formationId || 'pratique',
    sessionDate: initialData.sessionDate || 'session_oct_1',
    profile: initialData.profile || 'aviculteur',
    notes: initialData.notes || '',
    ...initialData
  });

  const [submitted, setSubmitted] = useState(false);
  const [callbackRequested, setCallbackRequested] = useState(false);

  const selectedFormation = FORMATIONS.find(f => f.id === formData.formationId) || FORMATIONS[1];

  const sessions = [
    { id: 'session_oct_1', label: 'Session Pro : 15 - 17 Octobre 2026 (Cocody)', spotsLeft: 3 },
    { id: 'session_oct_2', label: 'Session Pro : 28 - 30 Octobre 2026 (Cocody)', spotsLeft: 6 },
    { id: 'session_nov_1', label: 'Session Intensive : 12 - 16 Novembre 2026 (Cocody)', spotsLeft: 8 },
    { id: 'session_custom', label: 'Session Privée / Dates sur mesure (Sur devis)', spotsLeft: null }
  ];

  const profiles = [
    { id: 'aviculteur', label: '🐔 Aviculteur / Éleveur de volailles' },
    { id: 'pisciculteur', label: '🐟 Pisciculteur / Aquaculture' },
    { id: 'maraicher', label: '🌱 Maraîcher / Agriculteur biologique' },
    { id: 'entrepreneur', label: '🚀 Porteur de projet AgriTech / Investisseur' },
    { id: 'entreprise', label: '🏢 Entreprise agroalimentaire / Collectivité' },
    { id: 'curieux', label: '🔬 Étudiant / Chercheur / Passionné' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate clean WhatsApp pre-filled message
  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.whatsapp) {
      alert('Veuillez renseigner au moins votre nom et votre numéro WhatsApp.');
      return;
    }

    const sessionObj = sessions.find(s => s.id === formData.sessionDate);
    const profileObj = profiles.find(p => p.id === formData.profile);

    const message = `Bonjour ReWaste ! Je souhaite m'inscrire à une session de formation :
• Nom : ${formData.fullName}
• WhatsApp : ${formData.whatsapp}
• Email : ${formData.email || 'Non renseigné'}
• Ville : ${formData.city}
• Formule : ${selectedFormation.title} (${selectedFormation.priceFCFA})
• Session souhaitée : ${sessionObj ? sessionObj.label : formData.sessionDate}
• Mon profil : ${profileObj ? profileObj.label : formData.profile}
${formData.notes ? `• Projet / Remarques : ${formData.notes}` : ''}

Merci de me confirmer la disponibilité et les modalités d'inscription.`;

    const cleanPhone = CONTACT.cyrille.phoneClean;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setSubmitted(true);
  };

  const handleWaveDeposit = () => {
    // Deposit is 50,000 FCFA for practical or full price for 1 day
    const depositAmount = selectedFormation.id === 'initiation' ? 35000 : 50000;
    if (onOpenWave) {
      onOpenWave(depositAmount, `Acompte Formation ${selectedFormation.title} — ${formData.fullName || 'Candidat'}`);
    }
  };

  const handleRequestCallback = () => {
    setCallbackRequested(true);
    setTimeout(() => {
      alert(`Merci ${formData.fullName || ''} ! Cyrille ou Émile vous contactera sur le ${formData.whatsapp || 'numéro renseigné'} dans les prochaines 24 heures.`);
    }, 300);
  };

  return (
    <div id="inscription-formation" className="training-booking reveal">
      <div className="training-booking__card">
        <div className="training-booking__header">
          <span className="badge badge--leaf">📅 Réservations & Rendez-vous</span>
          <h3 className="training-booking__title">Réservez votre Place en Pépinière</h3>
          <p className="training-booking__desc">
            Nos sessions pratiques sont limitées à <strong>12 participants</strong> pour garantir un encadrement personnalisé. Remplissez ce formulaire pour bloquer votre créneau.
          </p>
        </div>

        {submitted ? (
          <div className="booking-success-box">
            <div className="booking-success-icon">🎉</div>
            <h4>Demande de Réservation Transmise !</h4>
            <p>
              Votre demande pour la formule <strong>{selectedFormation.title}</strong> a bien été ouverte sur WhatsApp. Notre équipe va vous répondre dans l'heure.
            </p>
            <div className="booking-success-actions">
              <button 
                className="btn btn--accent"
                onClick={handleWaveDeposit}
              >
                💳 Sécuriser définitivement ma place par acompte Wave
              </button>
              <button 
                className="btn btn--outline"
                onClick={() => setSubmitted(false)}
              >
                Modifier mes informations
              </button>
            </div>
          </div>
        ) : (
          <form className="training-booking__form" onSubmit={handleWhatsAppSubmit}>
            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Nom & Prénom <span className="req">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Ex: Jean-Luc Kouassi"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* WhatsApp */}
              <div className="form-group">
                <label htmlFor="whatsapp">Numéro WhatsApp <span className="req">*</span></label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  required
                  placeholder="+225 07 00 00 00 00"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Adresse Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="contact@exemple.ci"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* City / Country */}
              <div className="form-group">
                <label htmlFor="city">Ville & Pays</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Ex: Abidjan (Cocody)"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Formula */}
              <div className="form-group">
                <label htmlFor="formationId">Formule Souhaitée</label>
                <select
                  id="formationId"
                  name="formationId"
                  value={formData.formationId}
                  onChange={handleChange}
                  className="form-select"
                >
                  {FORMATIONS.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.title} — {f.duration} ({f.priceFCFA})
                    </option>
                  ))}
                </select>
              </div>

              {/* Session / Date */}
              <div className="form-group">
                <label htmlFor="sessionDate">Session Prévue</label>
                <select
                  id="sessionDate"
                  name="sessionDate"
                  value={formData.sessionDate}
                  onChange={handleChange}
                  className="form-select"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.label} {s.spotsLeft ? `(${s.spotsLeft} places restantes)` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profile */}
              <div className="form-group full-width">
                <label htmlFor="profile">Votre Profil d'Activité</label>
                <select
                  id="profile"
                  name="profile"
                  value={formData.profile}
                  onChange={handleChange}
                  className="form-select"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project notes */}
              <div className="form-group full-width">
                <label htmlFor="notes">Votre Projet / Vos Besoins Spécifiques (Facultatif)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  placeholder="Décrivez brièvement votre gisement de biodéchets, votre cheptel (volailles, poissons...) ou vos attentes..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-textarea"
                ></textarea>
              </div>
            </div>

            {/* Formula Summary Box */}
            <div className="booking-summary-pill">
              <div className="summary-pill-left">
                <span className="summary-pill-badge">Formule sélectionnée :</span>
                <strong>{selectedFormation.title} ({selectedFormation.duration})</strong>
              </div>
              <div className="summary-pill-right">
                <span className="summary-price">{selectedFormation.priceFCFA}</span>
                <span className="summary-tag">Tout inclus</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="booking-actions-row">
              <button
                type="submit"
                className="btn btn--whatsapp btn--lg booking-btn-main"
              >
                📱 Réserver & Valider sur WhatsApp →
              </button>

              <button
                type="button"
                className="btn btn--accent btn--lg"
                onClick={handleWaveDeposit}
              >
                💳 Payer l'acompte Wave (50 000 FCFA)
              </button>

              <button
                type="button"
                className={`btn btn--outline btn--sm ${callbackRequested ? 'btn--disabled' : ''}`}
                onClick={handleRequestCallback}
                disabled={callbackRequested}
              >
                {callbackRequested ? '✓ Demande d\'appel enregistrée' : '📞 Être rappelé par Cyrille'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
