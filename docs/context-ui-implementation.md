# Contexto para Implementação de Interfaces - Feature 001-admissao-membros

**Data**: 2025-11-08  
**Branch**: `001-admissao-membros`  
**Status**: APIs implementadas, faltam interfaces UI

## O que já foi implementado

### Backend/API (✅ Completo)
- ✅ POST /api/intentions - Criar intenção pública
- ✅ GET /api/admin/intentions - Listar intenções (admin)
- ✅ POST /api/admin/intentions/[id]/approve - Aprovar intenção
- ✅ POST /api/admin/intentions/[id]/reject - Rejeitar intenção
- ✅ GET /api/signup/validate?token=... - Validar token
- ✅ POST /api/signup - Completar cadastro
- ✅ GET /api/dashboard - KPIs do mês
- ✅ GET /api/reports?period=... - Relatórios por período

### Services e Validações (✅ Completo)
- ✅ `lib/services/intentions.ts` - Service de intenções
- ✅ `lib/services/admin-intentions.ts` - Service admin
- ✅ `lib/services/signup.ts` - Service de signup
- ✅ `lib/services/metrics.ts` - Service de métricas
- ✅ `lib/validation/intentions.ts` - Validações Zod
- ✅ `lib/middleware/auth.ts` - Middleware de autenticação admin

### Testes (✅ Parcial)
- ✅ Testes de contrato para POST /api/intentions
- ✅ Testes de contrato para GET /api/admin/intentions
- ✅ Testes de contrato para POST /api/admin/intentions/[id]/approve
- ✅ Testes de contrato para POST /api/admin/intentions/[id]/reject
- ✅ Teste de integração para fluxo de intenção via UI
- ⏳ Testes faltantes: signup, dashboard

### UI Existente (✅ Parcial)
- ✅ `app/intentions/page.tsx` - Página pública de intenção
- ✅ `components/forms/IntentionForm.tsx` - Formulário de intenção
- ✅ Componentes shadcn/ui básicos: Button, Input, Label

## O que falta implementar

### 1. Área Administrativa (`app/admin/page.tsx`)
**Requisitos**:
- Listar todas as intenções em tabela
- Mostrar: nome, email, empresa, status, data de criação
- Botões para aprovar/recusar cada intenção
- Filtros por status (pending, approved, rejected)
- Autenticação via `ADMIN_TOKEN` (header Authorization)
- Estados de loading e erro

**Componentes necessários**:
- Tabela (shadcn/ui Table)
- Badge para status
- Dialog/AlertDialog para confirmação
- Select para filtros

**API a usar**:
- GET /api/admin/intentions (com Authorization header)
- POST /api/admin/intentions/[id]/approve
- POST /api/admin/intentions/[id]/reject

### 2. Página de Cadastro (`app/signup/[token]/page.tsx`)
**Requisitos**:
- Validar token na montagem do componente
- Formulário com: nome, email, empresa
- Pré-preencher com dados da intenção (se disponível)
- Estados: loading, erro (token inválido/expirado/usado), sucesso
- Redirecionar após sucesso

**Componentes necessários**:
- Form (shadcn/ui Form)
- Input, Label (já existem)
- Alert para mensagens de erro/sucesso

**API a usar**:
- GET /api/signup/validate?token=...
- POST /api/signup

### 3. Dashboard (`app/dashboard/page.tsx`)
**Requisitos**:
- Exibir 3 KPIs em cards:
  - Membros Ativos
  - Indicações no Mês
  - Obrigados no Mês
- Estados de loading e erro
- Opcional: gráficos ou tabelas

**Componentes necessários**:
- Card (shadcn/ui Card)
- Badge ou números grandes
- Skeleton para loading

**API a usar**:
- GET /api/dashboard

## Stack e Padrões

### Tecnologias
- Next.js 16 (App Router)
- React 19.2
- shadcn/ui + Tailwind CSS
- TypeScript

### Cores e Tema
- Primary: `#06B8EB`
- Base: Azul Escuro `#0B1B34` e Branco `#FFFFFF`
- Dark mode: usar `next-themes` (já configurado)

### Padrões de Código
- Server Components quando possível
- Client Components apenas para interatividade
- Validação com Zod (já configurado)
- Estados de loading/erro em todas as páginas
- Acessibilidade básica (labels, foco, contraste)

### Estrutura de Arquivos
```
app/
├── admin/
│   └── page.tsx          # ⏳ FALTA CRIAR
├── signup/
│   └── [token]/
│       └── page.tsx      # ⏳ FALTA CRIAR
├── dashboard/
│   └── page.tsx          # ⏳ FALTA CRIAR
└── intentions/
    └── page.tsx          # ✅ JÁ EXISTE

components/
├── forms/
│   └── IntentionForm.tsx # ✅ JÁ EXISTE
└── ui/                   # ✅ Componentes básicos existem
```

## Autenticação Admin

Para rotas admin, usar header:
```typescript
headers: {
  'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
}
```

Em desenvolvimento, usar variável de ambiente `ADMIN_TOKEN` (já configurada).

## Documentação de Referência

- Arquitetura: `docs/architecture.md`
- API: `docs/api.md`
- Testes: `docs/testing.md`
- Guidelines: `docs/code-guidelines.md`
- Specs: `specs/001-admissao-membros/`

## Commits Sugeridos

Manter commits graduais:
1. `feat(ui): cria página admin com lista de intenções`
2. `feat(ui): adiciona ações de aprovar/recusar na página admin`
3. `feat(ui): cria página de signup com validação de token`
4. `feat(ui): cria dashboard com KPIs`
5. `test: adiciona testes de integração para interfaces`

## Próximos Passos

1. Criar componentes shadcn/ui necessários (Table, Card, Dialog, etc.)
2. Implementar página admin
3. Implementar página de signup
4. Implementar dashboard
5. Adicionar testes de integração
6. Fazer code review e PR para master

## Notas Importantes

- Todos os endpoints já estão funcionais e testados
- Usar os helpers de teste existentes em `tests/helpers/test-helpers.ts`
- Seguir padrões de código em `docs/code-guidelines.md`
- Manter acessibilidade e responsividade
- Usar logging estruturado já implementado

