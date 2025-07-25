import { db } from './firebase.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = JSON.parse(
  readFileSync(
    path.resolve(__dirname, '../data/trilhas-de-novelas.json'),
    'utf8'
  )
);

const seed = async () => {
  const ref = db.ref('trilhas-de-novelas');
  await ref.remove();

  for (const novela of data) {
    const trilhas = novela.trilhas.flatMap((trilha) =>
      trilha.faixas.map((faixa) => ({
        title: faixa.nome,
        artist: faixa.interprete,
        audio: faixa.audio || '',
        novela: novela.nome,
        tipo: trilha.tipo,
      }))
    );

    for (const faixa of trilhas) {
      const newRef = ref.push();
      await newRef.set(faixa);
    }
  }

  console.log('Dados inseridos com sucesso!');
  process.exit(0);
};

seed().catch((error) => {
  console.error('Erro ao inserir dados:', error);
  process.exit(1);
});
