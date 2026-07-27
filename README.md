<p align="center">
  <img src="https://github.com/nelispereira/nelispereira/blob/main/nelisofware.png?raw=true?raw=true" height="45" alt="nelisoftware Logo" />
</p>

## Description

[nelisoftware](https://nelisoftware.com) **Lotofácil System** — a web application for tracking, analyzing and generating games for the Brazilian Lotofácil lottery.

It fetches official draw results from Caixa's API, stores them in a database, and provides tools to help players make informed decisions:

- **Dashboard** — overview of the latest statistics and trends
- **Últimos Sorteios** — history of the latest draws
- **Conferir Cartão** — check a game's card against past/recent draws
- **Gerador de Jogos** — generate new game combinations based on statistical criteria
- **Backtest** — test generated games/strategies against historical draws
- **Sequências** — analysis of number sequences across draws
- **Ciclos / Ciclos Não Marcar** — cycle tracking (numbers that complete or are pending in a draw cycle)
- **Atualizar** — sync the latest draw results from Caixa
- **Usuários** — admin user management with approval workflow

## Technologies

- [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) ORM + MySQL
- [Auth.js (NextAuth v5)](https://authjs.dev/) for authentication
- [Tabler Icons](https://tabler.io/icons)
- [Axios](https://axios-http.com/) + [Luxon](https://moment.github.io/luxon/) + [Lodash](https://lodash.com/)
- [Vitest](https://vitest.dev/) for unit testing

## Getting started

```bash
npm install
npm run dev     # start the dev server
npm run build   # production build
npm run start   # start production server
npm run test    # run the test suite
```

Configure your environment variables based on `.env.example` (database connection, auth providers, etc.).

## Stay in touch

- Author - [Nelis Pereira](https://www.instagram.com/nelisnnp/)
- Website - [http://nelisoftware.com](http://nelisoftware.com/)

## License

Licensed to [nelisoftware](http://nelisoftware.com).
