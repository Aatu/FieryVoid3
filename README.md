# Airship game


## Running locally

The following commands should be ran in the root directory

`pnpm build` to install dependencies

`pnpm build:database` to build the dockerized database

`pnpm start:database` to start the database

`pnpm start` to start both server and client or `pnpm start:all` to also start the database


`pnpm typecheck` to check typescript type errors and `pnpm test` to run tests. If these fail, fix them.