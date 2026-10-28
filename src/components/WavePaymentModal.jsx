import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { WAVE_BASE_URL, PRESET_AMOUNTS } from '../data/siteData';
import './WavePaymentModal.css';

export default function WavePaymentModal({ isOpen, onClose, context = '', defaultAmount = 10000 }) {
  const [amount, setAmount] = useState(defaultAmount);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmount);
      setCopied(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, defaultAmount]);

  const waveUrl = `${WAVE_BASE_URL}${amount}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(waveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = waveUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [waveUrl]);

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmount(val ? parseInt(val, 10) : 0);
  };

  const formatFCFA = (num) => num.toLocaleString('fr-FR');

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal wave-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Wave Blue */}
        <div className="wave-modal__header">
          <div className="wave-modal__header-content">
            <div className="wave-modal__brand">
              <span className="wave-modal__cat">🐱</span>
              <div>
                <h3 className="wave-modal__title">Paiement Wave</h3>
                <p className="wave-modal__subtitle">ReWaste BSF • Abidjan</p>
              </div>
            </div>
            <button className="wave-modal__close" onClick={onClose} aria-label="Fermer">✕</button>
          </div>
          {context && <div className="wave-modal__context">{context}</div>}
        </div>

        {/* Body */}
        <div className="wave-modal__body">
          {/* Amount Input */}
          <label className="wave-modal__label">Montant à payer (FCFA)</label>
          <div className="wave-modal__input-wrap">
            <input
              type="text"
              inputMode="numeric"
              className="wave-modal__input"
              value={formatFCFA(amount)}
              onChange={handleAmountChange}
            />
            <span className="wave-modal__currency">FCFA</span>
          </div>

          {/* Preset Amounts */}
          <div className="wave-modal__presets">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                className={`wave-modal__preset ${amount === preset ? 'active' : ''}`}
                onClick={() => setAmount(preset)}
              >
                {formatFCFA(preset)} F
              </button>
            ))}
          </div>

          {/* QR Code Zone */}
          <div className="wave-modal__qr-zone">
            <div className="wave-modal__qr-label">
              Payez avec <span className="wave-modal__wave-text">wave</span>
            </div>
            <div className="wave-modal__qr-container">
              <QRCodeSVG
                value={waveUrl}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#0288D1"
                level="M"
                includeMargin
              />
            </div>
            <div className="wave-modal__qr-amount">
              {formatFCFA(amount)} FCFA
            </div>
            <div className="wave-modal__partners">
              PARTENAIRES : UBA • ORABANK
            </div>
          </div>

          {/* Instructions */}
          <div className="wave-modal__steps">
            <div className="wave-modal__step">
              <span className="wave-modal__step-num">①</span>
              <span>Ouvrez Wave CI sur votre smartphone</span>
            </div>
            <div className="wave-modal__step">
              <span className="wave-modal__step-num">②</span>
              <span>Scannez ce QR code</span>
            </div>
            <div className="wave-modal__step">
              <span className="wave-modal__step-num">③</span>
              <span>Validez le règlement pour ReWaste BSF</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="wave-modal__actions">
            <a
              href={waveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--wave btn--lg wave-modal__btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Ouvrir dans Wave (Mobile)
            </a>
            <button
              className={`btn wave-modal__btn-copy ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? '✓ Copié !' : '📋 Copier lien'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
