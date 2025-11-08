# Code Guidelines (Next.js 16 + React 19.2)

## Componentização e Arquitetura

- Single Responsibility: um único motivo de mudança por componente/arquivo.
- App Router: Server Components para dados/render, Client Components para interação/estado.
- O estado global deve ser mínimo; considerar React Query/Zustand apenas quando necessário.
- Colocation: componentes/hooks/testes perto do uso; utilitários em `lib/`.
- Props tipadas e minimalistas; evite "prop drilling" profundo (use Context com parcimônia).
- UI: padronizar com shadcn/ui; estilos via Tailwind; utilitário `cn()` para classes.
- Acessibilidade: semântica, labels, foco visível, contraste (Primary `#06B8EB`, base Azul Escuro `#0B1B34` e Branco `#FFFFFF`).

## Padrões de Pastas

- UI: `app/.../page.tsx`; Layout: `app/layout.tsx`.
- API: `app/api/.../route.ts` (validação, domínio e resposta consistente).
- Serviços: `lib/services/*.ts` (sem efeitos colaterais externos).
- Validações: `lib/validation/*.ts` (Zod schemas compartilháveis).

## TypeScript

- Modo estrito; evite `any` implícito.
- Funções curtas (~20–30 linhas) e early-return.
- APIs/serviços com tipos de entrada/saída explícitos.

## APIs e Contratos

- Validar entrada com Zod; erros com `{ code, message, details? }`.
- HTTP coerente: 400/401/404/409/422 conforme cenário; 200 com zeros quando sem dados (dashboard).
- Contratos versionados: `docs/openapi.yaml` é fonte de verdade; alinhar `docs/api.md`.

## Testes

- P1 (fluxo crítico): contratos + integração OBRIGATÓRIOS.
- Dashboard: contratos obrigatórios; integração opcional.
- AAA (Arrange–Act–Assert); evitar snapshots frágeis; asserts semânticos.

## Observabilidade e Segurança

- Logs estruturados (evento, entidade, ids, duração) sem dados sensíveis.
- Correlação por request id quando possível.
- Segredos somente em `.env.local` (não versionado).

## Performance

- Metas: CRUD p95 < 200ms; Dashboard p95 < 400ms com até 10k registros.
- Queries agregadas simples, índices adequados; evitar N+1.

## Qualidade Automatizada

- Lint/format: Biome (`pnpm biome:check` / `pnpm biome:write`).
- Typecheck: `pnpm typecheck` (sem erros antes do merge).
- Testes: `pnpm test` (contratos/integração do P1 devem passar).

## Revisões e PRs

- Referenciar esta página e a Constituição; listar histórias cobertas e contratos testados.
- Descrever impacto em contratos (se houver) e plano de migração.
