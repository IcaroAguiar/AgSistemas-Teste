# API — Plataforma de Gestão

Este documento descreve os principais endpoints REST. Autorização simplificada
para avaliação: `Authorization: Bearer ${ADMIN_TOKEN}` nas rotas admin.
Formato JSON. OpenAPI detalhado em `docs/openapi.yaml`.

## Autenticação (avaliação)

- Admin: token de ambiente (`ADMIN_TOKEN`)
- Público: sem autenticação (intenção e leitura de comunicados)

## Gestão de Membros

### POST /api/intentions

Cria intenção de participação (público).

Request:

```json
{ "name": "Ana", "email": "ana@ex.com", "company": "ACME" }
```

Response 201:

```json
{ "id": "uuid", "status": "pending", "createdAt": "2025-11-08T13:00:00Z" }
```

### GET /api/admin/intentions

Lista intenções (admin).

Response 200:

```json
[{ "id": "uuid", "name": "Ana", "email": "ana@ex.com", "status": "pending" }]
```

### POST /api/admin/intentions/{id}/approve

Aprova intenção e gera convite (admin).

Response 200:

```json
{ "message": "invitation created", "url": "https://app/cadastro/TOKEN" }
```

### POST /api/admin/intentions/{id}/reject

Rejeita intenção (admin).

Request (opcional):

```json
{ "reason": "Perfil não aderente" }
```

Response 204

### GET /api/signup/validate?token=...

Valida token de convite.

### POST /api/signup

Conclui cadastro com token.

Request:

```json
{ "token": "...", "name": "Ana", "email": "ana@ex.com", "company": "ACME" }
```

Response 201:

```json
{ "id": "uuid", "name": "Ana", "email": "ana@ex.com" }
```

## Comunicação e Engajamento

### GET /api/announcements

Lista comunicados (membros).

### POST /api/announcements (admin)

Cria comunicado.

Request:

```json
{ "title": "Aviso", "message": "Reunião às 8h" }
```

### PUT /api/announcements/{id} (admin)

Atualiza comunicado.

### DELETE /api/announcements/{id} (admin)

Remove comunicado.

## Reuniões e Presenças

### POST /api/meetings (admin)

Cria reunião.

Request:

```json
{ "title": "Semanal", "date": "2025-11-10T12:00:00Z", "type": "weekly" }
```

### GET /api/meetings

Lista reuniões.

### POST /api/meetings/{id}/checkin (membro)

Registra presença (status default: present).

## Indicações e Obrigados

### POST /api/referrals (membro)

Cria indicação.

Request:

```json
{ "toMemberId": "uuid", "prospect": "Loja XPTO", "value": 1000 }
```

### GET /api/referrals (membro)

Lista minhas indicações (feitas e recebidas).

### PATCH /api/referrals/{id}/status (membro)

Atualiza status: proposed|contacted|in_progress|won|lost.

### POST /api/gratitudes (membro)

Registra “obrigado”.

Request:

```json
{
  "toMemberId": "uuid",
  "referralId": "uuid",
  "message": "Fechamos!",
  "amount": 200
}
```

## 1:1, Dashboards e Relatórios

### POST /api/oneonones (membro)

Registra 1:1.

### GET /api/dashboard (membro/admin)

KPI básicos: membros ativos, indicações no mês, obrigados no mês.

### GET /api/reports?period=monthly|weekly|total (admin)

Relatórios por período.

## Financeiro

### POST /api/invoices/generate (admin)

Gera mensalidades do período.

### GET /api/invoices (membro/admin)

Lista mensalidades do membro (ou de todos, se admin).

### PATCH /api/invoices/{id}/status (admin)

Atualiza status para paid/overdue.
