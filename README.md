# Caixa Food

Base inicial de um MVP fullstack para operação de loja de comida, inspirado no documento funcional enviado para o projeto.

## O que já está estruturado

- App Router com páginas para `admin`, `pdv`, `cozinha`, `cardapio` e `login`
- Componentes reutilizáveis para shell, cards, tabelas, status e blocos de menu
- Prisma 7 configurado para PostgreSQL com schema multiempresa
- DAL `server-only` para centralizar leitura segura e evitar acesso direto ao banco no cliente
- Permissões por role (`ADMIN`, `CAIXA`, `COZINHA`, `ATENDENTE`)
- Validação server-side com `zod`
- Sessão assinada preparada com `jose`
- Helper de hash de senha com `argon2`

## Dependências mantidas enxutas

Foram evitadas bibliotecas de UI, form, estado global e utilitários simples.

As dependências extras ficaram focadas no que é estrutural:

- `@prisma/client`, `prisma`, `@prisma/adapter-pg`, `pg`
- `zod`
- `jose`
- `argon2`
- `server-only`

## Rodando localmente

1. Copie `.env.example` para `.env`
2. Ajuste `DATABASE_URL`
3. Gere um session secret com o comando: `openssl rand -base64 32`
4. Gere o client do Prisma:

```bash
pnpm prisma generate
```

4. Suba a aplicação:

```bash
pnpm dev
```

## Observações

- Em `DEMO_MODE=true`, a navegação usa uma sessão demo para acelerar a montagem do MVP.
- O cardápio público não depende das permissões internas.
- O cadastro rápido de produtos já usa Server Action com validação server-side.
- A persistência real com Prisma depende de um banco configurado em `DATABASE_URL`.
