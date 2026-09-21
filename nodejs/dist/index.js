import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { trace } from '@opentelemetry/api';
import mysql from 'mysql2';
import pg from 'pg';
import { Redis } from 'ioredis';
const app = new Hono();
const db = mysql.createPool('mysql://app:app@127.0.0.1:3309/app').promise();
const postgres = new pg.Pool({ connectionString: 'postgres://app:app@127.0.0.1:5432/app' });
const redis = new Redis('redis://127.0.0.1:6370', { lazyConnect: true });
redis.on('error', err => console.error(err));
app.onError((err, c) => {
    trace.getActiveSpan()?.recordException(err);
    if (err instanceof HTTPException)
        return err.getResponse();
    console.error(err);
    return c.text('Internal Server Error', 500);
});
app.get('/', async (c) => {
    const user = await (await fetch('https://randomuser.me/api/')).json();
    console.log(user);
    return c.text(`Hello ${user.results[0].name.first}`);
});
app.get('/mysql', async (c) => {
    const [rows] = await db.query('SELECT 1 AS ok');
    return c.json(rows);
});
app.get('/postgres', async (c) => {
    const { rows } = await postgres.query('SELECT 1 AS ok');
    return c.json(rows);
});
app.get('/redis', async (c) => c.text(await redis.ping()));
app.get('/error', c => {
    throw new Error('Test otel errors');
});
//prettier-ignore
serve({
    fetch: app.fetch,
    port: 3000
}, info => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
