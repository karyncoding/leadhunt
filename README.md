# LeadHunt

> Find businesses. Find opportunities.

Ferramenta **pessoal** de prospecção: você informa uma região e um nicho,
o LeadHunt busca estabelecimentos, analisa a presença digital deles
(website, WhatsApp, Instagram, Facebook) e calcula um **Opportunity
Score** (0–100) para te ajudar a priorizar quem mais precisa de um
site novo.

Esta é a **Etapa 1** do projeto: arquitetura, banco, score, CRUD de
leads e interface completos — tudo rodando sobre dados fictícios
(mock). Nenhuma integração externa real foi implementada ainda (ver
[Roadmap](#roadmap--próximas-fases)).

---

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- Componentes de UI no estilo shadcn/ui (primitivas próprias em
  `src/components/ui`, sem depender de instalação externa via CLI)
- [Supabase](https://supabase.com/) (PostgreSQL) para persistência dos leads
- lucide-react para ícones

## Estrutura do projeto

```
leadhunt/
├── supabase/
│   └── schema.sql              # schema do banco (tabela leads, índices, trigger)
├── src/
│   ├── app/                    # páginas (App Router)
│   │   ├── page.tsx             # Buscar Leads (home)
│   │   ├── leads/page.tsx       # Meus Leads
│   │   ├── favorites/page.tsx   # Favoritos
│   │   ├── settings/page.tsx    # Configurações
│   │   ├── layout.tsx           # layout raiz (sidebar, fontes, toasts)
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   └── sidebar.tsx
│   │   ├── leads/                # componentes específicos do domínio "lead"
│   │   │   ├── lead-search-form.tsx
│   │   │   ├── lead-results.tsx
│   │   │   ├── lead-search-card.tsx    # card de resultado (ainda não salvo)
│   │   │   ├── saved-lead-card.tsx     # card de lead já salvo
│   │   │   ├── lead-list-page.tsx      # lógica compartilhada: Meus Leads / Favoritos
│   │   │   ├── lead-detail-drawer.tsx
│   │   │   ├── opportunity-badge.tsx
│   │   │   ├── lead-status-badge.tsx
│   │   │   └── presence-indicator.tsx
│   │   └── ui/                   # primitivas (button, card, input, select, ...)
│   └── lib/
│       ├── types/lead.ts         # tipos centrais do domínio
│       ├── services/
│       │   ├── places/            # descoberta de estabelecimentos
│       │   │   ├── types.ts               # interface PlacesProvider
│       │   │   ├── mock-places-provider.ts # ⚠️ implementação mock (Etapa 1)
│       │   │   └── provider.ts             # fábrica getPlacesProvider()
│       │   ├── website-checker/   # verificação de sites (stub, Fase 3)
│       │   ├── social/            # dados públicos de redes sociais (stub, Fase 4)
│       │   ├── scoring/
│       │   │   └── opportunity-score.ts    # ÚNICA fonte da lógica de score
│       │   └── leads/              # CRUD da tabela `leads` (Supabase)
│       ├── supabase/               # clients (browser/server)
│       ├── mock/mock-businesses.ts # ⚠️ dados fictícios (Etapa 1)
│       └── utils/                  # cn, formatação, exportação CSV
├── .env.example
└── package.json
```

A ideia por trás dessa separação: **UI nunca fala diretamente com
Supabase ou com lógica de score** — ela sempre passa pelos serviços em
`lib/services/*`. Isso deixa claro onde trocar cada peça no futuro
(ex: `MockPlacesProvider` → `GooglePlacesProvider`) sem tocar em telas.

## Banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com/).
2. No **SQL Editor**, rode o conteúdo de `supabase/schema.sql`. Isso cria:
   - a tabela `leads` com todos os campos pedidos (dados do
     estabelecimento, flags de presença digital, `opportunity_score`,
     `status`, `notes`, `is_favorite`, `source` + `source_place_id`);
   - um índice único em `(source, source_place_id)` para evitar leads
     duplicados quando a busca real (Fase 2) for implementada;
   - índices em `status`, `is_favorite`, `opportunity_score`, `city` e
     `category` para as telas de listagem/filtro;
   - um trigger que mantém `updated_at` sempre atualizado.
3. Em **Settings → API**, copie a `Project URL` e a `anon public key`.

## Configuração local

```bash
cp .env.example .env.local
```

Preencha no `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

`SUPABASE_SERVICE_ROLE_KEY` e `GOOGLE_PLACES_API_KEY` já estão
preparadas no `.env.example` para as próximas fases — deixe em branco
por enquanto. **Nunca** commite o `.env.local` (já está no `.gitignore`).

## Como executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. A busca (tela "Buscar Leads") funciona
imediatamente com dados mock, mesmo sem Supabase configurado — mas
salvar/editar leads exige o `.env.local` preenchido.

## Opportunity Score

Toda a lógica vive em `src/lib/services/scoring/opportunity-score.ts`:

| Critério                     | Pontos |
|-------------------------------|--------|
| Sem website                   | +30    |
| Avaliação ≥ 4.5 (ou ≥ 4.0)     | +20 / +10 |
| Mais de 300 avaliações (ou 100) | +20 / +10 |
| Instagram disponível           | +10    |
| WhatsApp disponível             | +10    |

Score máximo: 100. Classificação: 90–100 Excelente · 75–89 Alta ·
50–74 Moderada · 0–49 Baixa. Para mudar a fórmula no futuro, edite
apenas esse arquivo — nenhuma tela soma pontos por conta própria.

## O que foi implementado (Etapa 1)

- Projeto Next.js + TypeScript + Tailwind rodando, com arquitetura em
  camadas (UI / componentes / serviços / acesso a dados / tipos).
- Schema completo do Supabase com índices e prevenção de duplicatas.
- Módulo de Opportunity Score isolado e testável.
- `MockPlacesProvider` com ~10 estabelecimentos fictícios, atrás de uma
  interface `PlacesProvider` pronta para trocar pelo Google Places.
- Interfaces preparadas (mas não implementadas) para `WebsiteChecker`
  e coleta de dados sociais.
- CRUD completo de leads (salvar da busca, listar, atualizar
  status/notas/favorito, excluir) via Supabase.
- Telas: Buscar Leads, Meus Leads, Favoritos, Configurações, e um
  drawer de detalhes com a explicação do score.
- UX: loading skeletons, empty states, toasts, confirmação de
  exclusão, layout responsivo.
- Exportação CSV dos leads salvos.

## O que ficou para a próxima etapa (de propósito)

- Busca real de estabelecimentos (Fase 2 — Google Places API ou
  equivalente).
- Verificação real de websites e descoberta automática de sites
  (Fase 3).
- Coleta de dados públicos adicionais de redes sociais (Fase 4).
- Evolução do algoritmo de score (Fase 5).
- Análise automática da qualidade do website encontrado (Fase 6).
- Geração de mensagens personalizadas de prospecção (Fase 7).
- CRM de prospecção mais completo (Fase 8).

## Roadmap / próximas fases

| Fase | Objetivo |
|------|----------|
| 2 | Integração com Places API |
| 3 | Descoberta/verificação de websites |
| 4 | Coleta de informações públicas adicionais |
| 5 | Score inteligente |
| 6 | Análise automática da qualidade do website |
| 7 | Geração de mensagens personalizadas de prospecção |
| 8 | CRM de prospecção |

## Segurança

- Nenhuma chave é usada no client além da `anon key` pública do
  Supabase (por design do Supabase, segura para o browser com RLS).
- `SUPABASE_SERVICE_ROLE_KEY` e `GOOGLE_PLACES_API_KEY` estão
  reservadas para uso apenas em código server-side nas próximas fases.
- Nenhuma chave real está commitada; use sempre `.env.local`.
