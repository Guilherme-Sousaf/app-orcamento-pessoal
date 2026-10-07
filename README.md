# 💰 Orça+ — Sistema de Gestão Financeira Pessoal

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![Conventional Commits](https://img.shields.io/badge/Conventional_Commits-1.0.0-fe5196?style=flat&logo=conventionalcommits)](https://www.conventionalcommits.org/)

Aplicação web completa para controle de finanças pessoais, projetada com foco em alta performance, privacidade rigorosa de dados e experiência do usuário (UX) premium.

---

## 📑 Sumário

- [Visão Geral e Arquitetura](#-visão-geral-e-arquitetura)
- [Recursos Principais](#-recursos-principais)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução Local](#-instalação-e-execução-local)
- [Configuração do Banco de Dados (Supabase)](#-configuração-do-banco-de-dados-supabase)
- [Estratégia de Branches (Git Flow)](#-estratégia-de-branches-git-flow)
- [Padrão de Commits (Conventional Commits)](#-padrão-de-commits-conventional-commits)
- [Segurança & Proteção de Dados](#-segurança--proteção-de-dados)

---

## 🏛️ Visão Geral e Arquitetura

O **Orça+** adota a arquitetura moderna do **Next.js App Router** com **Server Components** para leitura otimizada e **Server Actions** com validação no servidor via **Zod**. A camada de persistência utiliza **Supabase PostgreSQL** com isolamento integral através de **Row Level Security (RLS)**.

```mermaid
graph TD
    Client([Usuário / Browser]) <-->|HTTPS / Cookies SSR| NextServer[Next.js 16 Server]
    NextServer -->|Server Components & Actions| SupabaseSSR[@supabase/ssr Auth & RLS]
    SupabaseSSR <-->|PostgreSQL + Row Level Security| Postgres[(Supabase Database)]
    NextServer -->|UI Interativa / Charts| UI[Recharts + Tailwind CSS v4]
```

---

## ✨ Recursos Principais

- 📊 **Dashboard Consolidado**: Saldo total em tempo real, receitas do mês, despesas do mês e economia líquida.
- 📈 **Gráficos Analíticos com Recharts**:
  - Comparativo de fluxo mensal (Receitas x Despesas) dos últimos 6 meses.
  - Gráfico Donut de distribuição proporcional de gastos por categoria.
- 💳 **Gestão de Contas & Carteiras**: Saldos independentes para Conta Corrente, Poupança/Reserva, Cartão de Crédito, Carteira Física e Investimentos.
- 🏷️ **Categorização Flexível**: Separação clara entre receitas e despesas com identificadores visuais em cores e ícones.
- 🎯 **Orçamentos Mensais com Alertas**:
  - Tetos de despesa definidos por categoria/mês.
  - Indicadores visuais de progresso com alertas automáticos em **80% (Atenção)** e **100% (Estourado)**.
- 📥 **Exportação de Relatórios**: Download direto das transações filtradas em formato CSV (UTF-8 com pontuação brasileira).
- 🔒 **Segurança Nativa**: Autenticação por e-mail/senha com Supabase Auth e 100% das tabelas blindadas com políticas RLS (`auth.uid() = user_id`).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Framework** | Next.js 16+ (App Router) | Renderização híbrida (SSR + Server Actions) |
| **Linguagem** | TypeScript 5+ | Tipagem estrita de ponta a ponta |
| **Estilização** | Tailwind CSS v4 | Variáveis nativas, Dark Theme & Glassmorphism |
| **Database & Auth** | Supabase | PostgreSQL gerenciado + Autenticação SSR |
| **Validação** | Zod | Schemas estritos para dados e mutações |
| **Visualização** | Recharts | Gráficos responsivos de barras e rosca |
| **Ícones** | Lucide React | Biblioteca moderna de ícones vetoriais |

---

## 📁 Estrutura do Projeto

```
app-orcamento-pessoal/
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema_and_rls.sql          # Tabelas, índices e políticas RLS
│   │   └── 002_triggers_and_defaults.sql   # Trigger para inicialização no cadastro
│   └── README.md                           # Guia de implantação no Supabase
├── src/
│   ├── app/
│   │   ├── (auth)/                         # Rotas públicas de login e registro
│   │   ├── (dashboard)/                    # Rotas protegidas (Dashboard, Transações, etc.)
│   │   ├── api/export-csv/                 # Endpoint de exportação CSV
│   │   ├── globals.css                     # Design tokens e variáveis de tema
│   │   └── layout.tsx                      # Layout raiz da aplicação
│   ├── components/
│   │   ├── ui/                             # Button, Input, Modal, Card, Badge, Skeleton
│   │   ├── layout/                         # Sidebar, Topbar, MobileNav
│   │   ├── dashboard/                      # StatCards, Charts, RecentTransactions
│   │   ├── transactions/                   # TransactionTable, CreateTransactionModal
│   │   ├── budgets/                        # BudgetList, CreateBudgetModal
│   │   └── accounts/                       # AccountList, CreateAccountModal
│   ├── lib/
│   │   ├── supabase/                       # Clientes Browser, Server e Middleware SSR
│   │   ├── validations/                    # Schemas de validação Zod
│   │   ├── actions/                        # Server Actions seguras
│   │   └── data/finance.ts                 # Camada de agregação de métricas financeiras
│   ├── types/
│   │   └── database.types.ts               # Tipos TypeScript do modelo de dados
│   └── middleware.ts                       # Proteção de rotas autenticadas
├── .env.example                            # Modelo de variáveis de ambiente
├── .gitignore                              # Regras de exclusão para Git
├── next.config.ts                          # Configurações do Next.js
├── package.json                            # Dependências e scripts
└── tsconfig.json                           # Configuração do TypeScript
```

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- Node.js 20+ instalado
- Gerenciador de pacotes `npm`, `pnpm` ou `yarn`
- Uma conta ativa no [Supabase](https://supabase.com)

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/app-orcamento-pessoal.git
cd app-orcamento-pessoal
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```
Edite `.env.local` informando as credenciais do seu projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🗄️ Configuração do Banco de Dados (Supabase)

1. Acesse o painel do seu projeto no Supabase.
2. Navegue até **SQL Editor** > **New Query**.
3. Execute sequencialmente:
   - Conteúdo de `supabase/migrations/001_schema_and_rls.sql`
   - Conteúdo de `supabase/migrations/002_triggers_and_defaults.sql`
4. Em **Authentication** > **Providers** > **Email**, certifique-se de que o provedor está ativo. *(Dica: em ambiente de testes locais, desmarque "Confirm email" para agilizar os testes de login imediato)*.

---

## 🌿 Estratégia de Branches (Git Flow)

Adotamos um fluxo baseado em **Git Flow simplificado**, garantindo rastreabilidade, isolamento de código e estabilidade em produção:

```
[main] ──────────────────────────●──────────── (Produção estável)
                                 ▲
                                 │ Pull Request
[develop] ──────●────────────────●────●────── (Homologação / Integração)
                ▲                     ▲
                │ Pull Request        │ Pull Request
[feature/*] ────●                     │
[fix/*] ──────────────────────────────●
```

### 1. Branches Principais
- **`main`**: Reflete o código em produção. **Bloqueada para commits diretos**; alterações só entram via Pull Request aprovado vindo de `develop` ou `hotfix/*`.
- **`develop`**: Branch de integração contínua. Reúne todas as novas funcionalidades testadas antes da liberação para produção.

### 2. Branches Temporárias de Trabalho
- **`feature/<nome-da-feature>`**: Novas funcionalidades (ex: `feature/exportacao-pdf`, `feature/grafico-anual`).
  - Criação: derivada de `develop`.
  - Merge: volta para `develop` via Pull Request.
- **`fix/<nome-do-bug>`**: Correções de bugs em ambiente de desenvolvimento (ex: `fix/calculo-saldo-cartao`).
  - Derivada de `develop` e mesclada em `develop`.
- **`hotfix/<nome-da-correcao>`**: Correções urgentes diretamente em produção.
  - Derivada de `main` e mesclada tanto em `main` quanto em `develop`.

---

## ✍️ Padrão de Commits (Conventional Commits)

Todas as mensagens de commit devem seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo opcional>): <descrição curta no imperativo>

[corpo detalhado opcional]

[rodapé opcional (ex: Refs #123)]
```

### Tipos Permitidos:
- **`feat`**: Nova funcionalidade para o usuário (ex: `feat(transactions): add filters by date range`).
- **`fix`**: Correção de bug (ex: `fix(auth): handle email confirmation redirect`).
- **`docs`**: Alterações exclusivas na documentação (ex: `docs: update setup and git flow guide`).
- **`style`**: Ajustes de formatação ou estilo sem impacto na lógica (ex: `style(dashboard): improve card border opacity`).
- **`refactor`**: Refatoração de código sem alterar comportamento (ex: `refactor(finance): optimize balance aggregation query`).
- **`test`**: Adição ou ajuste de testes (ex: `test(validations): add test cases for transactionSchema`).
- **`chore`**: Tarefas de manutenção, dependências ou infraestrutura (ex: `chore(deps): update recharts to v2.15`).

---

## 🛡️ Segurança & Proteção de Dados

- **Proteção de Segredos**: O arquivo `.gitignore` bloqueia estritamente `.env`, `.env*.local` e quaisquer arquivos de certificados/chaves. Apenas `.env.example` sem valores sensíveis é versionado.
- **Isolamento RLS**: Nenhuma query acessa dados de outro usuário, pois todas as tabelas contam com políticas de Row Level Security no PostgreSQL do Supabase.
- **Validação de Entrada**: Toda entrada de formulário é validada no servidor com Zod antes de qualquer inserção ou mutação.

---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.
