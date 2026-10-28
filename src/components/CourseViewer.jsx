import { useState } from 'react';
import jsPDF from 'jspdf';
import { LMS_CHAPTERS } from '../data/coursesData';
import './CourseViewer.css';

export default function CourseViewer() {
  const [activeChapterId, setActiveChapterId] = useState(LMS_CHAPTERS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const activeChapter = LMS_CHAPTERS.find(c => c.id === activeChapterId) || LMS_CHAPTERS[0];

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({
      ...prev,
      [idx]: prev[idx] !== undefined ? !prev[idx] : false // default is expanded if undefined
    }));
  };

  const handleExportPDF = (chapter) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Theme Colors
    doc.setFillColor(27, 77, 62); // #1B4D3E
    doc.rect(0, 0, 210, 35, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('ReWaste BSF — Support de Cours Officiel', 14, 16);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Centre de Formation & Pépinière Pilote • Cocody, Abidjan', 14, 24);

    // Chapter Header
    doc.setTextColor(27, 77, 62);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Chapitre ${chapter.number} : ${chapter.title}`, 14, 48);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text(chapter.subtitle, 14, 55);

    // Summary Box
    doc.setFillColor(245, 249, 246);
    doc.roundedRect(14, 62, 182, 20, 2, 2, 'F');
    doc.setTextColor(44, 47, 45);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(`Synthèse : ${chapter.summary}`, 174);
    doc.text(summaryLines, 18, 69);

    let y = 92;

    // Sections
    chapter.sections.forEach((sec, idx) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(27, 77, 62);
      doc.text(`${idx + 1}. ${sec.heading}`, 14, y);
      y += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);

      // Clean markdown bullets
      const cleanContent = sec.content.replace(/\*/g, '');
      const contentLines = doc.splitTextToSize(cleanContent, 182);
      
      contentLines.forEach(line => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 14, y);
        y += 4.5;
      });

      y += 4;
    });

    // Key Points Box
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(235, 247, 238);
    doc.rect(14, y, 182, 8, 'F');
    doc.setTextColor(27, 77, 62);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('POINTS CLÉS À RETENIR :', 18, y + 5.5);
    y += 12;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);

    chapter.keyPoints.forEach(kp => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      const kpLines = doc.splitTextToSize(`• ${kp}`, 176);
      doc.text(kpLines, 18, y);
      y += kpLines.length * 4.2;
    });

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`ReWaste BSF — Page ${p}/${totalPages} • Support réservé aux apprenants et partenaires`, 14, 290);
    }

    doc.save(`ReWaste_LMS_Chapitre_${chapter.number}.pdf`);
  };

  return (
    <div className="course-viewer reveal">
      {/* Course Header Banner */}
      <div className="course-viewer__header">
        <div className="course-viewer__meta">
          <span className="badge badge--leaf">📖 Support de Cours & Pédagogie Officielle</span>
          <h3 className="course-viewer__main-title">Manuel Pratique d'Élevage BSF (4 Chapitres)</h3>
          <p className="course-viewer__main-desc">
            Retrouvez l'intégralité du programme d'enseignement dispensé lors de nos formations à Abidjan : 
            biologie de l'insecte, formulation des rations, ingénierie des unités et modèle économique.
          </p>
        </div>

        <div className="course-viewer__controls">
          <div className="course-search-box">
            <span className="course-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher dans le cours (ex: BCR, nurserie, C/N, huile)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="course-search-input"
            />
          </div>
          <button
            className="btn btn--secondary btn--sm course-dl-btn"
            onClick={() => handleExportPDF(activeChapter)}
            title="Télécharger ce chapitre au format PDF imprimable"
          >
            📥 Télécharger le Chapitre {activeChapter.number} en PDF
          </button>
        </div>
      </div>

      {/* Chapters Navigation Tabs */}
      <div className="course-chapters-nav">
        {LMS_CHAPTERS.map((ch) => (
          <button
            key={ch.id}
            className={`chapter-nav-btn ${activeChapterId === ch.id ? 'active' : ''}`}
            onClick={() => {
              setActiveChapterId(ch.id);
              setExpandedSections({});
            }}
          >
            <div className="chapter-nav-badge">
              <span className="ch-num">{ch.number}</span>
              <span className="ch-icon">{ch.icon}</span>
            </div>
            <div className="chapter-nav-info">
              <span className="chapter-nav-title">{ch.title}</span>
              <span className="chapter-nav-tag">{ch.badge}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Chapter Content */}
      <div className="course-chapter-body">
        {/* Chapter Header Card */}
        <div className="chapter-hero-card">
          <div className="chapter-hero-top">
            <span className="badge badge--leaf">Chapitre {activeChapter.number} • {activeChapter.badge}</span>
            <span className="chapter-hero-readtime">⏱ ~10 min de lecture</span>
          </div>
          <h2 className="chapter-hero-title">{activeChapter.title}</h2>
          <p className="chapter-hero-subtitle">{activeChapter.subtitle}</p>
          <div className="chapter-hero-summary">
            <strong>🎯 Objectif pédagogique :</strong> {activeChapter.summary}
          </div>
        </div>

        {/* Chapter Sections */}
        <div className="chapter-sections-list">
          {activeChapter.sections
            .filter(sec => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return sec.heading.toLowerCase().includes(q) || sec.content.toLowerCase().includes(q);
            })
            .map((sec, idx) => {
              const isExpanded = expandedSections[idx] !== false; // default true
              return (
                <div key={idx} className={`chapter-section-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  <button
                    className="section-card-header"
                    onClick={() => toggleSection(idx)}
                    aria-expanded={isExpanded}
                  >
                    <div className="section-card-title-group">
                      <span className="section-index-bubble">{idx + 1}</span>
                      <h4 className="section-heading-text">{sec.heading}</h4>
                    </div>
                    <span className="section-toggle-icon">{isExpanded ? '▲' : '▼'}</span>
                  </button>

                  {isExpanded && (
                    <div className="section-card-content">
                      {sec.content.split('\n\n').map((paragraph, pIdx) => {
                        // Check if paragraph is list
                        if (paragraph.includes('•') || paragraph.includes('1.') || paragraph.includes('2.')) {
                          const lines = paragraph.split('\n');
                          return (
                            <div key={pIdx} className="section-list-block">
                              {lines.map((line, lIdx) => (
                                <p key={lIdx} className="section-list-line">
                                  {line.trim()}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <p key={pIdx} className="section-paragraph">
                            {paragraph.trim()}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Chapter Key Points Checklist */}
        <div className="chapter-keypoints-box">
          <div className="keypoints-header">
            <span className="keypoints-icon">✅</span>
            <h4>Points Clés & Règles d'Or du Chapitre {activeChapter.number}</h4>
          </div>
          <div className="keypoints-grid">
            {activeChapter.keyPoints.map((point, kIdx) => (
              <div key={kIdx} className="keypoint-card">
                <span className="keypoint-check">✓</span>
                <span className="keypoint-text">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner to Practical Training */}
        <div className="chapter-action-footer">
          <div className="chapter-action-text">
            <strong>Vous souhaitez passer de la théorie à la pratique sur le terrain ?</strong>
            <p>Venez manipuler nos serres de reproduction et nos bacs d'élevage aux côtés de Cyrille et Émile.</p>
          </div>
          <a href="#inscription-formation" className="btn btn--accent btn--md">
            🎓 Réserver ma Session Pratique →
          </a>
        </div>
      </div>
    </div>
  );
}
