# Projeto Final: Programacao Web

Co-op project by Simon and Rodrigo. Local-AI chat web app, ChatGPT/Claude-style interface talking to Ollama running on each developer's machine.

## Team & Hardware

| | Developer | Machine | GPU (VRAM) | CPU (max boost) | RAM |
|-|-----------|---------|-----------|-----------------|-----|
| Dev 1 | Simon | Lenovo Legion Y540-15IRH | RTX 2060 Mobile (6 GB) | i7-9750H (4.5 GHz) | 16 GB |
| Dev 2 | Rodrigo | Asus TUF Gaming A15 FA507NV (2023) | RTX 4060 Mobile (8 GB) | Ryzen 7 7735HS (4.75 GHz) | 32 GB |

### VRAM allocation strategy

Each machine runs its own primary model and reserves 2 GB for cross-checking:

| Machine | Primary model | Reserved for cross-check |
|---------|--------------|--------------------------|
| Simon (RTX 2060, 6 GB) | ~4 GB | 2 GB |
| Rodrigo (RTX 4060, 8 GB) | ~6 GB | 2 GB |

**Deep thinking mode:** when activated, each machine's 2 GB slice runs a smaller verifier model that cross-checks the other machine's primary output. Both machines can initiate this (Simon checks Rodrigo's response and vice versa).

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16.2.4 + React Bootstrap ^2.10.10 |
| Backend/CMS | Strapi 5 (SQLite dev / Postgres prod) |
| Inference | Ollama (local, exposed via Cloudflare Tunnel) |
| API Docs | @strapi/plugin-documentation (Swagger) |

## Structure

```
/
├── backend/    # Strapi 5
└── frontend/   # Next.js 16
```

## Dev setup

```bash
# Backend
cd backend/back && npm run develop

# Frontend
cd frontend/front && npm run dev
```

See `.hidden/plan.md` for full build plan (gitignored).

## Deadlines

- **Jun 23**: DB + REST APIs, Swagger docs, anonymous CRUD
- **Jun 30**: Next.js CRUD UI consuming Strapi APIs
- **Final**: Auth, roles, deployed (Vercel + Strapi Cloud)
