# My Menu frontend

React 19, TanStack Start e shadcn/ui. O build padrão executa o SSR e as funções de servidor no Cloudflare Workers, com assets estáticos gerados pelo Vite. O backend continua em `https://api.my-menu.net`.

## Desenvolvimento

Use Node.js 22.12 ou superior.

```sh
npm ci --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

`npm run dev` executa o servidor no runtime local da Cloudflare (`workerd`). As variáveis `VITE_API_URL` e `VITE_FRONTEND_URL` são públicas e incorporadas ao build. `.env.production` contém apenas os endpoints públicos de produção. Nunca coloque tokens ou outros segredos em variáveis `VITE_*`.

## Validação

```sh
npm run typecheck
npm run lint
npm test
npm run test:workers
npm run deploy:dry-run
```

`test:workers` compila o projeto, inicia `vite preview` no `workerd` e verifica HTML SSR, assets, hidratação, navegação e seleção/cadastro de cliente no pedido manual. A API do navegador é interceptada; esses testes não criam registros no backend. A página inicial pode fazer sua consulta pública de leitura durante o SSR. Para instalar o navegador, use `npx playwright install chromium`.

## Deploy no Cloudflare Workers

O `wrangler.jsonc` usa o Worker **my-app**, preserva seu domínio **my-menu.net** e habilita logs de observabilidade. A integração oficial do Vite gera `dist/server/wrangler.json`, junto ao código do Worker e aos assets. O Wrangler detecta essa configuração gerada; não publique o entrypoint TypeScript sem compilar primeiro.

Forneça `CLOUDFLARE_API_TOKEN` no ambiente do processo, a partir do arquivo externo de credenciais ou do secret do CI. Se necessário, forneça também `CLOUDFLARE_ACCOUNT_ID`. Esses valores não pertencem ao repositório.

```sh
npm run deploy:dry-run
npm run deploy
```

Após o deploy, confira `https://my-menu.net/`, `/auth`, um cardápio existente e os assets referenciados no HTML. O endereço `workers.dev` serve para conferir o Worker; o domínio de produção deve ser usado para cookies, CORS, Google OAuth e QR Codes.

Para testar o build localmente:

```sh
npm run build
npm run preview
```

## Execução alternativa em Node.js / Docker

A opção Node.js continua disponível e gera artefatos diferentes do build do Worker:

```sh
npm run build:node
npm start
```

O Dockerfile utiliza Node.js 22 e `build:node`. Não execute `npm start` sobre os artefatos do build padrão de Workers.
