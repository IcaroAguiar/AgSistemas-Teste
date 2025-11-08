# Data Model — Plataforma de Gestão

**Versão**: 0.2 | **Data**: 2025-11-08

## Entidades e Restrições

### Member

- id: uuid (pk)
- name: string (1..120)
- email: string (email, unique)
- company: string (1..160)
- role: enum(admin|member) = member
- status: enum(active|inactive) = active
- joinedAt: datetime (nullable até cadastro concluir)

Índices: email unique; (status), (joinedAt)

### Intention (candidatura)

- id: uuid (pk)
- name: string
- email: string (email)
- company: string
- status: enum(pending|approved|rejected) = pending
- reason: string|null
- createdAt: datetime
- updatedAt: datetime

Regras: enquanto pending, email deve ser único entre intenções; ao aprovar, vincular Invitation

### Invitation (convite)

- id: uuid (pk)
- intentionId: uuid (fk -> Intention.id)
- tokenHash: string (sha256, unique)
- expiresAt: datetime (now + 7d)
- usedAt: datetime|null
- createdAt: datetime

Regra: não permitir uso após expiresAt ou se usedAt != null

### Announcement (avisos)

- id: uuid (pk)
- title: string (1..140)
- message: text (1..5000)
- publishedAt: datetime
- authorId: uuid (fk -> Member.id)

### Meeting (reuniões)

- id: uuid (pk)
- title: string
- date: datetime
- location: string|null
- type: enum(weekly|special)

### Attendance (presença)

- id: uuid (pk)
- meetingId: uuid (fk -> Meeting.id)
- memberId: uuid (fk -> Member.id)
- status: enum(present|absent|late) = present
- checkinAt: datetime|null

Índice único: (meetingId, memberId)

### Referral (indicações)

- id: uuid (pk)
- fromMemberId: uuid (fk -> Member.id)
- toMemberId: uuid (fk -> Member.id)
- prospect: string (1..160)
- value: number|null
- status: enum(proposed|contacted|in_progress|won|lost) = proposed
- notes: text|null
- createdAt: datetime
- updatedAt: datetime

### Gratitude (obrigados)

- id: uuid (pk)
- fromMemberId: uuid (fk -> Member.id)
- toMemberId: uuid (fk -> Member.id)
- referralId: uuid|null (fk -> Referral.id)
- message: string (1..280)
- amount: number|null
- createdAt: datetime

### OneOnOne (reuniões 1:1)

- id: uuid (pk)
- memberAId: uuid (fk -> Member.id)
- memberBId: uuid (fk -> Member.id)
- occurredAt: datetime
- notes: text|null

Índice único: (memberAId, memberBId, occurredAt)

### Invoice (mensalidades)

- id: uuid (pk)
- memberId: uuid (fk -> Member.id)
- dueDate: date
- amount: number
- status: enum(pending|paid|overdue) = pending
- paidAt: datetime|null
- reference: string|null

## Relacionamentos

- Member 1..\* Announcement (authorId)
- Meeting 1.._ Attendance; Member 1.._ Attendance
- Member 1..\* Referral (from/to)
- Referral 0..\* Gratitude (opcional)
- Member 1..\* OneOnOne (como A ou B)
- Member 1..\* Invoice
- Intention 1..1 Invitation (quando approved)

## Migração Prisma (esboço)

- Definir enums conforme acima
- Chaves e índices conforme restrições
- Tabela de junção não necessária além de Attendance e OneOnOne

## Notas de Portabilidade

- SQLite (dev): adequa-se ao teste. Em produção, usar PostgreSQL, mesmo schema
  (ajustar tipos numéricos e índices parciais se necessário).
