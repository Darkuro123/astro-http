// src/pages/api/clients.ts (o como se llame)
import { createClient } from '@libsql/client/web';
import type { APIRoute } from 'astro';

export const prerender = false;

// Crea el cliente una vez — ¡pero NO fuera del handler si hay cold starts!
// En Workers, mejor crearlo dentro de cada handler (ligero y seguro).
export const GET: APIRoute = async ({ request }) => {
  const client = createClient({
    url: import.meta.env.ASTRO_DB_REMOTE_URL!,
    authToken: import.meta.env.ASTRO_DB_APP_TOKEN!,
  });

  try {
    const result = await client.execute('SELECT * FROM Clients');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET Clients error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch clients' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const client = createClient({
    url: import.meta.env.ASTRO_DB_REMOTE_URL!,
    authToken: import.meta.env.ASTRO_DB_APP_TOKEN!,
  });

  try {
    const body = await request.json();
    const { id, ...data } = body;

    // Inserta y obtén el ID autogenerado
    const insertResult = await client.execute({
      sql: 'INSERT INTO Clients (name, email, /* otros campos */) VALUES (?, ?, ?)',
      args: [data.name, data.email /*, ...otros valores */],
    });

    // LibSQL devuelve `lastInsertRowid` en `insertResult` (si la tabla tiene INTEGER PRIMARY KEY)
    const newId = Number(insertResult.lastInsertRowid);

    return new Response(
      JSON.stringify({ id: newId, ...data }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('POST Clients error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create client' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};