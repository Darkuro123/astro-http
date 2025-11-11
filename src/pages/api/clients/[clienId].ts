import type { APIRoute } from "astro";
import { Clients, db, eq } from "astro:db";

export const prerender = false;


export const GET: APIRoute = async ({params, request}) => {

    const clienId = params.clienId ?? ''

    const clients = await db.select().from(Clients).where(eq(Clients.id, +clienId));
    if(clients.length === 0) {

        return new Response(JSON.stringify({msg: `Client whit id ${clienId} not fount`}), {status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    return new Response(JSON.stringify(clients.at(0)), {status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
export const PATCH: APIRoute = async ({params, request}) => {

    const clienId = params.clienId ?? ''

    try{
            const {id, ...body} = await request.json();
            
            const results = await db.update(Clients).set(body).where(eq(Clients.id, +clienId));
            
            const updateClient = await db.select().from(Clients).where(eq(Clients.id, +clienId));

            return new Response(JSON.stringify(updateClient.at(0)), {status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }catch (error){
            console.log(error)
            return new Response(JSON.stringify({msg: "no bosy found"}), {status: 201,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
}
export const DELETE: APIRoute = async ({params, request}) => {

    const clienId = params.clienId ?? ''

    const {rowsAffected} = await db.delete(Clients).where(eq(Clients.id, +clienId));
    if(rowsAffected > 0) {

        
        return new Response(JSON.stringify({msg: 'Deleted'}), {status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    return new Response(JSON.stringify({msg: `Client with id ${clienId} not found`}), {status: 404,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}