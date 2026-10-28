import { useState, useRef } from 'react';
import './VideoIntroSection.css';

export default function VideoIntroSection() {
  const [activeVideo, setActiveVideo] = useState('emile');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const videos = {
    emile: {
      id: 'emile',
      title: 'Vision ReWaste & Message des Co-Fondateurs',
      speaker: 'Kouessi Émile Hognikou & Cyrille',
      role: 'Co-Fondateurs ReWaste BSF • Cocody, Abidjan',
      src: '/videos/intro_emile.mp4',
      poster: '/images/founders.jpg',
      badge: 'Présentation Officielle',
      duration: '0:35 min',
      description: 'Découvrez la vision d’Émile et Cyrille : transformer les défis environnementaux d\'Abidjan en une opportunité agricole et économique souveraine grâce à la mouche soldat noire.',
      highlights: [
        'Écosystème pionnier en Côte d\'Ivoire',
        'Formation pratique + Rachat garanti des larves',
        'Soutien technique continu via WhatsApp Pro'
      ]
    },
    recherche: {
      id: 'recherche',
      title: 'Immersion en Pépinière & Recherche Industrielle',
      speaker: 'Équipe Technique ReWaste',
      role: 'Unité Expérimentale & Production de Géniteurs',
      src: '/videos/intro_recherche.mp4',
      poster: '/images/nursery_real.jpg',
      badge: 'R&D & Pépinière',
      duration: '0:45 min',
      description: 'Visite immersive au cœur de notre pépinière : Love Cages de reproduction, induction lumineuse 440/540 nm, nurserie climatisée et calibrage des larves 5-DOL.',
      highlights: [
        'Conditions d\'élevage contrôlées (28-30°C, 70% HR)',
        'Calibrage au gramme près pour les éleveurs satellites',
        'Standards sanitaires et biosécurité stricts'
      ]
    }
  };

  const current = videos[activeVideo];

  const handleVideoSelect = (key) => {
    setActiveVideo(key);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section id="video-intro" className="video-intro-section reveal">
      <div className="container">
        {/* Section Header */}
        <div className="section__heading" style={{ marginBottom: '2rem' }}>
          <span className="section__eyebrow">🎬 Présentation & Immersion</span>
          <h2 className="section__title">Au Cœur de la Révolution ReWaste</h2>
          <p className="section__subtitle">
            Faites connaissance avec les fondateurs et explorez nos installations de bioconversion à Cocody 2 Plateaux.
          </p>
        </div>

        {/* Video Switcher Tabs */}
        <div className="video-switcher-tabs">
          <button
            className={`video-tab-btn ${activeVideo === 'emile' ? 'active' : ''}`}
            onClick={() => handleVideoSelect('emile')}
          >
            <span className="video-tab-icon">👤</span>
            <div className="video-tab-text">
              <span className="video-tab-label">Vidéo 1</span>
              <span className="video-tab-name">Message des Fondateurs (Émile & Cyrille)</span>
            </div>
            <span className="video-tab-duration">0:35</span>
          </button>

          <button
            className={`video-tab-btn ${activeVideo === 'recherche' ? 'active' : ''}`}
            onClick={() => handleVideoSelect('recherche')}
          >
            <span className="video-tab-icon">🔬</span>
            <div className="video-tab-text">
              <span className="video-tab-label">Vidéo 2</span>
              <span className="video-tab-name">Visite Pépinière Industrielle & Nurserie</span>
            </div>
            <span className="video-tab-duration">0:45</span>
          </button>
        </div>

        {/* Video Player Card */}
        <div className="video-player-card">
          <div className="video-player-wrapper">
            <video
              ref={videoRef}
              key={current.src}
              src={current.src}
              poster={current.poster}
              controls
              playsInline
              className="video-element"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {!isPlaying && (
              <button 
                className="video-play-overlay" 
                onClick={togglePlay}
                aria-label={`Lire la vidéo ${current.title}`}
              >
                <div className="play-button-pulse">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </div>
                <span className="play-overlay-text">Lancer la vidéo</span>
              </button>
            )}

            <div className="video-badge-overlay">
              <span className="badge badge--leaf">{current.badge}</span>
            </div>
          </div>

          {/* Video Metadata & Description */}
          <div className="video-info-panel">
            <div className="video-info-header">
              <span className="video-speaker-tag">🗣️ {current.speaker}</span>
              <span className="video-role-tag">{current.role}</span>
            </div>

            <h3 className="video-info-title">{current.title}</h3>
            <p className="video-info-desc">{current.description}</p>

            <div className="video-highlights">
              <div className="highlights-title">Points Clés de la Présentation :</div>
              <ul className="highlights-list">
                {current.highlights.map((h, i) => (
                  <li key={i}>
                    <span className="highlight-bullet">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="video-founder-strip">
              <img 
                src="/images/founders.jpg" 
                alt="Cyrille et Kouessi Émile Hognikou" 
                className="founder-mini-avatar"
              />
              <div className="founder-mini-text">
                <strong>Cyrille & Émile</strong>
                <span>Pionniers de la bioconversion BSF en Côte d'Ivoire</span>
              </div>
              <a 
                href="#formations" 
                className="btn btn--accent btn--sm founder-strip-cta"
              >
                🎓 Participer à la Masterclass →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
