const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace FloatingDockLeft import
code = code.replace(
  'FloatingDockLeft,',
  'FloatingSpeedDialLeft,'
);

// We will find the sections and extract their inner content.
function extractSection(id) {
  const regex = new RegExp(`<section id="${id}"[^>]*>([\\s\\S]*?)</section>`);
  const match = code.match(regex);
  if (match) {
    return match[1];
  }
  return null;
}

const produitsInner = extractSection('produits');
const calculateurInner = extractSection('calculateur');
const mediathequeInner = extractSection('mediatheque');
const glossaireInner = extractSection('glossaire');

if (!produitsInner || !calculateurInner || !mediathequeInner || !glossaireInner) {
  console.error("Could not find all sections");
  process.exit(1);
}

// Replace the inner contents with variables
code = code.replace(produitsInner, '\n            {boutiqueContent}\n          ');
code = code.replace(calculateurInner, '\n            {calculateurContent}\n          ');
code = code.replace(mediathequeInner, '\n            {mediathequeContent}\n          ');
code = code.replace(glossaireInner, '\n            {glossaireContent}\n          ');

// Insert the variables right before the return statement of App
const returnIndex = code.lastIndexOf('  return (');

const variablesCode = `
  const [activeModal, setActiveModal] = useState(null);

  const boutiqueContent = (
    <>${produitsInner}</>
  );

  const calculateurContent = (
    <>${calculateurInner}</>
  );

  const mediathequeContent = (
    <>${mediathequeInner}</>
  );

  const glossaireContent = (
    <>${glossaireInner}</>
  );

`;

code = code.slice(0, returnIndex) + variablesCode + code.slice(returnIndex);

// Replace FloatingDockLeft usage with FloatingSpeedDialLeft
code = code.replace(
  '<FloatingDockLeft currentView={currentView} onNavigate={handleNavigate} />',
  '<FloatingSpeedDialLeft onOpenModal={setActiveModal} />'
);

// Add the QuickAccessModal right before the closing </div> of App
const quickAccessModalCode = `
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
`;

const lastDivIndex = code.lastIndexOf('    </div>');
code = code.slice(0, lastDivIndex) + quickAccessModalCode + code.slice(lastDivIndex);

fs.writeFileSync('src/App.jsx', code);
console.log("Refactoring complete.");
