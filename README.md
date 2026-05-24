# Lene Salgados System

Monorepo para o sistema de gestao da Lene Salgados.

## Estrutura

- `frontend`: sistema administrativo em React + Vite.
- `backend`: API Node.js + Express.
- `kds`: tela de cozinha/TV em React + Vite.
- `site-pedidos`: reservado para o site externo de pedidos.
- `docs`: documentacao tecnica, schema Supabase e proximos passos.

## Primeiros comandos

```bash
npm install
npm run dev:frontend
npm run dev:backend
npm run dev:kds
```

## Modo atual: local-first

Nesta fase, o sistema usa dados ilustrativos locais servidos pelo backend em `backend/src/mockData.ts`.

Isso permite construir todos os modulos no VS Code primeiro. Depois que o sistema estiver fechado, a camada de dados sera migrada para Supabase/PostgreSQL e hospedagem externa.

## Supabase futuro

O projeto ainda nao tem credenciais Supabase. Use os arquivos `.env.example` como base quando o projeto Supabase for criado na fase de migracao.

O schema inicial esta em `docs/supabase-schema.sql`.
