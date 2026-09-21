# SigNoz: empty DB Call Metrics

Reproduced on SigNoz **v0.142.1**, Windows Node **26.5.1**, MySQL **8.4**, and `@opentelemetry/instrumentation-mysql2` **0.68.0**.

With SigNoz running and OTLP HTTP exposed at `localhost:4318`, run from the repo root:

```sh
docker compose -f services/compose.yml up -d node-monitoring-mysql
cd nodejs
bun install
bun dev
```

Once MySQL is ready, open `http://localhost:3000/mysql` several times. Expected response: `[{"ok":1}]`.

In SigNoz, select service **hono** and the last 15 minutes:

- **Actual:** traces contain a `SELECT` client span, but **DB Call Metrics** stays empty.
- **Expected:** MySQL calls appear in DB Call Metrics.
- Instrumentation emits `db.system.name = mysql`; the pane expects legacy `db.system`. Related: [#8164](https://github.com/SigNoz/signoz/issues/8164).

Route: `nodejs/src/index.ts`. Instrumentation: `nodejs/telemetry.mjs`. MySQL uses port **3309**, database/user/password **app**.
