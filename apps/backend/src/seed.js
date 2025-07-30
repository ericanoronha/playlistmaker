import { db } from './firebase.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(
  readFileSync(
    path.resolve(__dirname, '../data/trilhas-de-novelas.json'),
    'utf8',
  ),
);

const seed = async () => {
  const ref = db.ref('trilhas-de-novelas');
  await ref.remove();

  for (const novela of data) {
    for (const trilha of novela.trilhas) {
      for (const faixa of trilha.faixas) {
        const faixaObj = {
          title: faixa.nome,
          artist: faixa.interprete,
          audio: faixa.audio || '',
          novela: novela.nome,
          tipo: trilha.tipo,
          ano: novela.ano || null,
        };

        const newRef = ref.push();
        await newRef.set(faixaObj);
      }
    }
  }

  console.log('Dados inseridos com sucesso!');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Erro ao inserir dados:', error);
  process.exit(1);
});
