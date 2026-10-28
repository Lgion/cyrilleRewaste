const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

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

// Replace the inner contents with variables
code = code.replace(produitsInner, '\n            {boutiqueContent}\n          ');
code = code.replace(calculateurInner, '\n            {calculateurContent}\n          ');
code = code.replace(mediathequeInner, '\n            {mediathequeContent}\n          ');
code = code.replace(glossaireInner, '\n            {glossaireContent}\n          ');

// Insert the variables right before the return statement of App
const returnIndex = code.lastIndexOf('  return (');

const variablesCode = `
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

fs.writeFileSync('src/App.jsx', code);
