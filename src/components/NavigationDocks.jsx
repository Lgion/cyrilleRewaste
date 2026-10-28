import { useState } from 'react';
import {
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon,
  WhatsAppIcon,
  PhoneIcon,
  SocialHubIcon
} from './SocialIcons';
import { CONTACT } from '../data/siteData';
import './NavigationDocks.css';

export function FloatingSpeedDialLeft({ onOpenModal }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fabs-group fabs-group--left">
      {/* Speed-Dial Submenu */}
      <div 
        className={`fab-speeddial fab-speeddial--left ${menuOpen ? 'fab-speeddial--open' : ''}`}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <button 
          className="fab-item fab-item--lexique"
          onClick={() => { onOpenModal('lexique'); setMenuOpen(false); }}
        >
          📖
          <span className="fab-item__tooltip fab-item__tooltip--right">Lexique & Termes</span>
        </button>

        <button 
          className="fab-item fab-item--ressources"
          onClick={() => { onOpenModal('ressources'); setMenuOpen(false); }}
        >
          📚
          <span className="fab-item__tooltip fab-item__tooltip--right">Ressources & Vidéos</span>
        </button>

        <button 
          className="fab-item fab-item--simulateur"
          onClick={() => { onOpenModal('simulateur'); setMenuOpen(false); }}
        >
          🧮
          <span className="fab-item__tooltip fab-item__tooltip--right">Simulateur BSF</span>
        </button>

        <button 
          className="fab-item fab-item--boutique"
          onClick={() => { onOpenModal('boutique'); setMenuOpen(false); }}
        >
          🛒
          <span className="fab-item__tooltip fab-item__tooltip--right">Boutique & Intrants</span>
        </button>
      </div>

      {/* Trigger Button */}
      <button
        className={`fab fab--quickaccess ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(prev => !prev)}
        onMouseEnter={() => setMenuOpen(true)}
        aria-label="Accès Rapide"
        title="Accès Rapide"
      >
        ⚡
      </button>
    </div>
  );
}

export function FloatingSpeedDialRight({ whatsappUrl, phoneClean }) {
  const [socialsOpen, setSocialsOpen] = useState(false);

  return (
    <div className="fabs-group">
      {/* Social Speed-Dial Menu */}
      <div 
        className={`fab-speeddial ${socialsOpen ? 'fab-speeddial--open' : ''}`}
        onMouseEnter={() => setSocialsOpen(true)}
        onMouseLeave={() => setSocialsOpen(false)}
      >
        <a 
          href={CONTACT.socials.tiktok} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fab-item fab-item--tiktok"
          title="TikTok (@plantzilla4)"
        >
          <TikTokIcon size={20} />
          <span className="fab-item__tooltip">TikTok • @plantzilla4</span>
        </a>

        <a 
          href={CONTACT.socials.youtube} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fab-item fab-item--youtube"
          title="YouTube (@KouessiÉmileHognikou)"
        >
          <YouTubeIcon size={20} />
          <span className="fab-item__tooltip">YouTube • 18 vidéos</span>
        </a>

        <a 
          href={CONTACT.socials.facebook} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="fab-item fab-item--facebook"
          title="Facebook Officiel ReWaste"
        >
          <FacebookIcon size={20} />
          <span className="fab-item__tooltip">Facebook Officiel</span>
        </a>
      </div>

      {/* Button to toggle Socials */}
      <button
        className={`fab fab--socials ${socialsOpen ? 'active' : ''}`}
        onClick={() => setSocialsOpen(prev => !prev)}
        onMouseEnter={() => setSocialsOpen(true)}
        aria-label="Nos réseaux sociaux"
        title="Réseaux Sociaux ReWaste"
      >
        <SocialHubIcon size={22} />
        <span className="fab__badge">3</span>
      </button>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fab fab--whatsapp"
        aria-label="Contacter sur WhatsApp"
        title="WhatsApp Cyrille (+225 07 04 76 31 32)"
      >
        <span className="fab__pulse"></span>
        <WhatsAppIcon size={26} />
      </a>

      {/* Phone Direct Call Button */}
      <a
        href={`tel:${phoneClean}`}
        className="fab fab--phone"
        aria-label="Appeler directement"
        title="Appel direct Cyrille"
      >
        <PhoneIcon size={22} />
      </a>
    </div>
  );
}
