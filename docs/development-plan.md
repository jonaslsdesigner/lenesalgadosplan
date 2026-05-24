# Plano de desenvolvimento

## Decisao atual

O projeto sera desenvolvido primeiro em modo local-first, com dados ilustrativos dentro do VS Code. A migracao para Supabase, backend hospedado e demais plataformas fica para depois que os modulos principais estiverem prontos.

## Fase atual

Base do monorepo criada com:

- `frontend`: painel administrativo inicial.
- `backend`: API Express com healthcheck, endpoints locais e webhook de pedidos em modo local.
- `kds`: tela de cozinha inicial consumindo pedidos locais.
- `site-pedidos`: sinalizado para fase final.
- `docs/supabase-schema.sql`: schema inicial para executar no Supabase.

## Proxima fase

1. Criar uma camada de login local ilustrativa.
2. Implementar rotas/telas do sistema principal.
3. Construir Dashboard com dados vindos do backend local.
4. Construir Financeiro com entradas, saidas e semanas segunda-domingo.
5. Construir Pedidos com status e reflexo no KDS.

## Migracao futura

1. Criar projeto no Supabase.
2. Executar `docs/supabase-schema.sql`.
3. Copiar `.env.example` para `.env` em `frontend`, `backend` e `kds`.
4. Substituir `backend/src/mockData.ts` por consultas reais.
5. Implementar Supabase Auth e RLS em producao.

## Ordem dos modulos

1. Login e layout com protecao de rotas.
2. Dashboard real usando dados do Supabase.
3. Financeiro com entradas, saidas e semanas segunda-domingo.
4. Pedidos com realtime.
5. KDS conectado em realtime.
6. Estoque, fornecedores e CRM.
7. Relatorios mensais e PDF.
8. Site externo de pedidos.
