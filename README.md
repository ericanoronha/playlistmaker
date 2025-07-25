# PlaylistMaker App

Aplicação fullstack de criação e gerenciamento de playlists de músicas.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Banco de Dados: Firebase Realtime Database
- Infraestrutura: Docker + Docker Compose

## Como executar localmente

```bash
git clone https://github.com/ericanoronha/playlistmaker
cd playlistmaker
```

```bash
npm run install:all && npm run dev
```

```bash
docker-compose up --build
```

Acesse o app em: [http://localhost:5173](http://localhost:5173)

---

Para rodar os testes automatizados:

```bash
cd apps/backend
npm run test -- --coverage
```

## Deploy automático

- Configurado via GitHub Actions e Docker Hub
- A imagem é publicada em `ericanbezerra/playlistmaker`
- O Render consome essa imagem automaticamente

---

## Banco de dados
![Screenshot do banco de dados realtime com seed populando dados](firebase.png)

Feito com ♡ por [@ericanoronha](https://github.com/ericanoronha)
