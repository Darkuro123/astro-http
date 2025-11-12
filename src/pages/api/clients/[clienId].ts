// src/pages/api/clients/[clienId].ts
import { createClient } from '@libsql/client/web';
import type { APIRoute } from 'astro';

export const prerender = false;

function getClient() {
  return createClient({
    url: import.meta.env.ASTRO_DB_REMOTE_URL!,
    authToken: import.meta.env.ASTRO_DB_APP_TOKEN!,
  });
}

export const GET: APIRoute = async ({ params }) => {
  const client = getClient();
  const clienId = params.clienId ?? '';

  if (!clienId) {
    return new Response(JSON.stringify({ msg: 'Client ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await client.execute({
      sql: 'SELECT * FROM Clients WHERE id = ?',
      args: [+clienId],
    });

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ msg: `Client with id ${clienId} not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const client = getClient();
  const clienId = params.clienId ?? '';

  if (!clienId) {
    return new Response(JSON.stringify({ msg: 'Client ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();

    // Validar que haya campos para actualizar
    if (Object.keys(body).length === 0) {
      return new Response(JSON.stringify({ msg: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construir dinámicamente SET clause
    const keys = Object.keys(body);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const args = [...keys.map((key) => body[key]), +clienId];

    const updateResult = await client.execute({
      sql: `UPDATE Clients SET ${setClause} WHERE id = ?`,
      args,
    });

    if (updateResult.rowsAffected === 0) {
      return new Response(
        JSON.stringify({ msg: `Client with id ${clienId} not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener el cliente actualizado
    const selectResult = await client.execute({
      sql: 'SELECT * FROM Clients WHERE id = ?',
      args: [+clienId],
    });

    return new Response(JSON.stringify(selectResult.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PATCH error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update client' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const client = getClient();
  const clienId = params.clienId ?? '';

  if (!clienId) {
    return new Response(JSON.stringify({ msg: 'Client ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await client.execute({
      sql: 'DELETE FROM Clients WHERE id = ?',
      args: [+clienId],
    });

    if (result.rowsAffected === 0) {
      return new Response(
        JSON.stringify({ msg: `Client with id ${clienId} not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ msg: 'Deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete client' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};