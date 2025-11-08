# Documentação de Testes

**Versão**: 1.0 | **Data**: 2025-11-08

## Estratégia de Testes

Este projeto utiliza uma estratégia de testes em camadas, seguindo a pirâmide de testes:

1. **Testes de Contrato (Contract Tests)**: Validam contratos de API conforme OpenAPI
2. **Testes de Integração (Integration Tests)**: Validam fluxos end-to-end
3. **Testes Unitários (Unit Tests)**: Validam funções isoladas

## Estrutura de Testes

```
tests/
├── contract/          # Testes de contrato de API
├── integration/       # Testes de integração end-to-end
├── unit/              # Testes unitários (futuro)
└── helpers/           # Helpers e utilitários para testes
```

## Tipos de Testes

### Testes de Contrato

**Localização**: `tests/contract/`

**Objetivo**: Garantir que os endpoints da API seguem o contrato definido em `docs/openapi.yaml`.

**Tecnologias**: Jest + supertest (via helpers customizados)

**Exemplos**:
- `intentions.post.spec.ts` - Valida POST /api/intentions
- `admin.intentions.get.spec.ts` - Valida GET /api/admin/intentions
- `admin.intentions.approve.spec.ts` - Valida POST /api/admin/intentions/{id}/approve
- `admin.intentions.reject.spec.ts` - Valida POST /api/admin/intentions/{id}/reject

**Cobertura**: Todas as rotas P1 e P2 possuem testes de contrato obrigatórios.

### Testes de Integração

**Localização**: `tests/integration/`

**Objetivo**: Validar fluxos completos do usuário através da interface.

**Tecnologias**: Jest + React Testing Library + @testing-library/user-event

**Exemplos**:
- `intentions.ui.spec.tsx` - Testa fluxo completo de submissão de intenção via UI

**Cobertura**: Obrigatórios para P1 (US1-US3), opcionais para P2 (US4).

### Testes Unitários

**Localização**: `tests/unit/` (futuro)

**Objetivo**: Validar lógica de negócio isolada em services e utilitários.

**Cobertura**: Services, validações, utilitários.

## Como Executar Testes

### Todos os testes

```bash
pnpm test
```

### Testes específicos

```bash
# Apenas testes de contrato
pnpm test -- tests/contract

# Apenas testes de integração
pnpm test -- tests/integration

# Um arquivo específico
pnpm test -- tests/contract/intentions.post.spec.ts
```

### Modo watch

```bash
pnpm test:watch
```

## Configuração do Jest

O projeto utiliza configuração multi-projeto no Jest:

- **Ambiente DOM**: Para testes de integração (React components)
- **Ambiente Node**: Para testes de contrato (API routes)

Configuração em `jest.config.ts`.

## Helpers de Teste

### `tests/helpers/test-helpers.ts`

Fornece utilitários para testar Next.js App Router API Routes:

- `createMockRequest()` - Cria mock de NextRequest
- `getJsonResponse()` - Extrai JSON de Response

## Cobertura por Módulo

### P1 - Admissão de Membros

| Módulo | Contract Tests | Integration Tests | Status |
|--------|---------------|-------------------|--------|
| POST /api/intentions | ✅ | ✅ | Completo |
| GET /api/admin/intentions | ✅ | ⏳ | Em progresso |
| POST /api/admin/intentions/{id}/approve | ✅ | ⏳ | Em progresso |
| POST /api/admin/intentions/{id}/reject | ✅ | ⏳ | Em progresso |
| GET /api/signup/validate | ⏳ | ⏳ | Pendente |
| POST /api/signup | ⏳ | ⏳ | Pendente |

### P2 - Dashboard de Performance

| Módulo | Contract Tests | Integration Tests | Status |
|--------|---------------|-------------------|--------|
| GET /api/dashboard | ⏳ | ⏳ | Pendente |
| GET /api/reports | ⏳ | ⏳ | Pendente |

## Exemplos de Casos de Teste

### Teste de Contrato - Criar Intenção

```typescript
it("deve criar uma intenção com dados válidos e retornar 201", async () => {
  const validData = {
    name: "João Silva",
    email: "joao@example.com",
    company: "TechCorp",
  };

  const request = createMockRequest("POST", "/api/intentions", validData);
  const response = await POST(request);
  const body = await getJsonResponse(response);

  expect(response.status).toBe(201);
  expect(body).toMatchObject({
    id: expect.any(String),
    name: validData.name,
    email: validData.email,
    status: "PENDING",
  });
});
```

### Teste de Integração - Submeter Intenção via UI

```typescript
it("deve submeter intenção com sucesso através do formulário", async () => {
  const user = userEvent.setup();
  render(<IntentionForm />);

  await user.type(screen.getByLabelText(/nome/i), "João Silva");
  await user.type(screen.getByLabelText(/email/i), "joao@example.com");
  await user.click(screen.getByRole("button", { name: /enviar/i }));

  await waitFor(() => {
    expect(screen.getByText(/intenção enviada/i)).toBeInTheDocument();
  });
});
```

## Boas Práticas

1. **AAA Pattern**: Arrange-Act-Assert em todos os testes
2. **Isolamento**: Cada teste deve ser independente
3. **Limpeza**: Limpar dados de teste antes/depois de cada teste
4. **Nomes descritivos**: Nomes de teste devem descrever o comportamento esperado
5. **Evitar snapshots frágeis**: Preferir asserts semânticos

## Relatório de Cobertura

Para gerar relatório de cobertura (quando configurado):

```bash
pnpm test -- --coverage
```

## Notas

- Testes de contrato são executados em ambiente Node.js
- Testes de integração são executados em ambiente jsdom
- Banco de dados de teste: SQLite em memória ou arquivo temporário
- Variáveis de ambiente: Usar `.env.test` ou variáveis inline nos testes

## Próximos Passos

- [ ] Adicionar testes unitários para services
- [ ] Adicionar testes de integração para fluxos admin
- [ ] Adicionar testes de contrato para signup
- [ ] Adicionar testes de contrato para dashboard
- [ ] Configurar relatório de cobertura
- [ ] Adicionar testes de performance

