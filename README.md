# AgSistemas - Plataforma de Gestão para Grupos de Networking

Plataforma fullstack desenvolvida para digitalizar e otimizar a gestão de grupos de networking, substituindo planilhas e controles manuais por um sistema centralizado e eficiente.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Testes](#testes)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Documentação](#documentação)
- [Contribuição](#contribuição)

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido como parte de um teste técnico para demonstrar habilidades em arquitetura de software, desenvolvimento fullstack com Node.js/Next.js/React e boas práticas de desenvolvimento.

A plataforma oferece um sistema completo para gestão de grupos de networking, incluindo:

- **Gestão de Membros**: Fluxo completo de admissão com intenções, aprovações e cadastro
- **Dashboard**: Métricas e indicadores de desempenho do grupo
- **Área Administrativa**: Painel para gerenciar intenções e aprovações
- **Proteção de Rotas**: Sistema de autenticação baseado em token com proxy do Next.js 16
- **Tema Claro/Escuro**: Interface adaptável com suporte a múltiplos temas

## 🛠 Tecnologias

### Frontend

- **Next.js 16** (App Router)
- **React 19.2**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes UI)
- **react-hook-form** (gerenciamento de formulários)
- **Zod** (validação de schemas)
- **Sonner** (notificações toast)
- **next-themes** (gerenciamento de temas)

### Backend

- **Next.js API Routes**
- **Node.js 20 LTS**
- **Prisma ORM**
- **SQLite** (desenvolvimento) / **PostgreSQL** (produção recomendada)

### Ferramentas de Desenvolvimento

- **pnpm** (gerenciador de pacotes)
- **Biome** (linter e formatter)
- **Jest** (testes)
- **React Testing Library** (testes de componentes)
- **supertest** (testes de API)

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 20.x ou superior
- **pnpm** 9.x ou superior
- **Git**

## 🚀 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd AgSistemas-Teste
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações (veja [Configuração](#configuração)).

4. Configure o banco de dados:

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

5. (Opcional) Popule o banco com dados de exemplo:

```bash
pnpm prisma:seed
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# URL Base da Aplicação
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Token de Administração (para área admin)
ADMIN_TOKEN="dev-admin-token-change-in-production"
```

### Variáveis de Ambiente

- `DATABASE_URL`: URL de conexão com o banco de dados (SQLite para dev)
- `NEXT_PUBLIC_BASE_URL`: URL base da aplicação (usado para gerar links)
- `ADMIN_TOKEN`: Token de autenticação para área administrativa (obrigatório para acessar `/administracao` e `/dashboard`)

**Importante**: O `ADMIN_TOKEN` deve ser configurado no arquivo `.env.local` (não versionado). Este token é usado para:
- Autenticação nas rotas de API administrativas
- Acesso às páginas `/administracao` e `/dashboard` (protegidas pelo proxy.ts)
- Login administrativo na landing page

## ▶️ Como Executar

### Desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

### Acesso Administrativo

Para acessar as áreas administrativas (`/administracao` e `/dashboard`):

1. Acesse a landing page (`http://localhost:3000`)
2. Clique no botão "Admin" no canto superior direito
3. Insira o token configurado na variável `ADMIN_TOKEN`
4. Após login bem-sucedido, o menu de navegação administrativa aparecerá automaticamente

**Nota**: As rotas administrativas são protegidas no nível de servidor pelo `proxy.ts`. Tentativas de acesso direto sem token válido serão redirecionadas para a landing page.

### Produção

1. Build da aplicação:

```bash
pnpm build
```

2. Inicie o servidor:

```bash
pnpm start
```

## 📁 Estrutura do Projeto

```
AgSistemas-Teste/
├── app/                          # Next.js App Router
│   ├── administracao/           # Área administrativa (protegida)
│   ├── api/                      # API Routes
│   │   ├── admin/                # Rotas administrativas (protegidas)
│   │   ├── intentions/           # Rotas de intenções
│   │   ├── signup/               # Rotas de cadastro
│   │   └── dashboard/            # Rotas de dashboard (protegidas)
│   ├── cadastro/[token]/        # Página de cadastro completo
│   ├── dashboard/                # Dashboard de métricas (protegido)
│   ├── interesse/                # Formulário de intenção
│   ├── recuperar-link/          # Recuperação de link de cadastro
│   ├── status-intencao/          # Consulta de status
│   └── page.tsx                  # Landing page (pública)
├── components/                   # Componentes React reutilizáveis
│   ├── AdminLogin.tsx            # Componente de login administrativo
│   ├── AdminNavigation.tsx       # Menu de navegação admin (protegido)
│   ├── forms/                    # Formulários
│   ├── providers/                # Providers (Theme, etc)
│   └── ui/                       # Componentes shadcn/ui
├── proxy.ts                      # Proxy do Next.js 16 para proteção de rotas
├── lib/                          # Bibliotecas e utilitários
│   ├── errors/                   # Classes de erro customizadas
│   ├── logger/                   # Sistema de logging
│   ├── middleware/               # Middlewares (auth, etc)
│   ├── services/                 # Serviços de negócio
│   └── validation/               # Schemas Zod
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Schema do banco de dados
│   └── seed.ts                   # Seed do banco de dados
├── public/                       # Arquivos estáticos
│   └── images/                   # Imagens
├── tests/                        # Testes
│   └── contract/                 # Testes de contrato
├── docs/                         # Documentação
│   ├── api.md                    # Documentação da API
│   ├── architecture.md           # Documentação de arquitetura
│   └── code-guidelines.md       # Diretrizes de código
└── specs/                        # Especificações do projeto
```

## ✨ Funcionalidades

### ✅ Implementadas

#### Gestão de Membros

- ✅ Formulário público de intenção de participação
- ✅ Área administrativa para aprovar/recusar intenções
- ✅ Formulário de cadastro completo com token seguro
- ✅ Consulta de status de intenção por email
- ✅ Recuperação de link de cadastro

#### Dashboard

- ✅ Dashboard privado com métricas do grupo
- ✅ Indicadores de desempenho (membros ativos, indicações, obrigados)
- ✅ Comparação com mês anterior
- ✅ Visualizações com gráficos e badges de tendência

#### Segurança e Autenticação

- ✅ Proteção de rotas privadas via proxy.ts (Next.js 16)
- ✅ Autenticação administrativa baseada em token (ADMIN_TOKEN)
- ✅ Login administrativo discreto na landing page
- ✅ Menu de navegação protegido que aparece apenas quando autenticado
- ✅ Validação de token no nível de servidor e cliente

#### Interface

- ✅ Tema claro/escuro
- ✅ Design responsivo
- ✅ Componentes acessíveis (shadcn/ui)
- ✅ Notificações toast (Sonner)
- ✅ Navegação intuitiva
- ✅ Separação clara entre áreas públicas e privadas

### 🚧 Planejadas (Arquitetura)

- Comunicação e Engajamento (avisos, reuniões, check-in)
- Sistema de Indicações e Referências
- Acompanhamento de Performance (1:1, relatórios)
- Módulo Financeiro (mensalidades)

## 🧪 Testes

Execute os testes:

```bash
# Todos os testes
pnpm test

# Modo watch
pnpm test:watch
```

### Estrutura de Testes

- **Testes Unitários**: Componentes e funções utilitárias
- **Testes de Integração**: API Routes e serviços
- **Testes de Contrato**: Validação de contratos de API

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento
pnpm build            # Build para produção
pnpm start            # Inicia servidor de produção

# Qualidade de Código
pnpm typecheck        # Verifica tipos TypeScript
pnpm lint             # Executa linter
pnpm format           # Formata código

# Banco de Dados
pnpm prisma:generate  # Gera Prisma Client
pnpm prisma:migrate   # Executa migrações
pnpm prisma:seed      # Popula banco com dados de exemplo

# Testes
pnpm test             # Executa testes
pnpm test:watch       # Executa testes em modo watch
```

## 📚 Documentação

- [Documentação de Arquitetura](./docs/architecture.md) - Visão geral da arquitetura do sistema
- [Documentação da API](./docs/api.md) - Especificação dos endpoints da API
- [Diretrizes de Código](./docs/code-guidelines.md) - Padrões e convenções de código

## 🤝 Contribuição

Este é um projeto de teste técnico. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula, etc
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Mudanças em build, dependências, etc

## 📝 Licença

Este projeto é privado e não possui licença pública.

## 👤 Autor

Desenvolvido como parte de teste técnico para AgSistemas.

---

**Nota**: Este projeto foi desenvolvido como demonstração técnica. Para uso em produção, considere:

- Migração para PostgreSQL
- Implementação de autenticação robusta
- Sistema de envio de emails
- Monitoramento e observabilidade
- Testes de carga e performance
- CI/CD pipeline
