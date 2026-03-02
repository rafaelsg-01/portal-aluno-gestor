// Importar arquivos HTML
import Html_client from '../static/client.html'
import Html_admin from '../static/admin.html'
import Html_loginClient from '../static/login-client.html'
import Html_registerClient from '../static/register-client.html'
import Html_loginAdmin from '../static/login-admin.html'
import Html_registerAdmin from '../static/register-admin.html'
import Html_landing from '../static/landing.html'
import { Type_envData } from './types'
export { Class_WebsocketNotificacaoTest } from './Class_WebsocketPortalAlunoGestor'


export default {
    async fetch(Parameter_request: Request, Parameter_env: Type_envData, Parameter_context: ExecutionContext): Promise<Response> {
        const url = new URL(Parameter_request.url)
        const pathname = url.pathname.endsWith('/') && url.pathname.length > 1 ? url.pathname.slice(0, -1) : url.pathname;

        // --- LANDING PAGE ---
        if (url.pathname === "/" || url.pathname === "") {
            return new Response(Html_landing, { headers: { "content-type": "text/html; charset=utf-8" } })
        }

        // --- AUTH ROUTES ---
        if (url.pathname === "/login-client") {
            return new Response(Html_loginClient, { headers: { "content-type": "text/html; charset=utf-8" } })
        }
        if (url.pathname === "/register-client") {
            return new Response(Html_registerClient, { headers: { "content-type": "text/html; charset=utf-8" } })
        }
        if (url.pathname === "/login-admin") {
            return new Response(Html_loginAdmin, { headers: { "content-type": "text/html; charset=utf-8" } })
        }
        if (url.pathname === "/register-admin") {
            return new Response(Html_registerAdmin, { headers: { "content-type": "text/html; charset=utf-8" } })
        }

        // --- PROTECTED ROUTES ---
        if (url.pathname === "/client") {
            // Simple Cookie Check
            const cookie = Parameter_request.headers.get("Cookie");
            if (!cookie || !cookie.includes("user=")) {
                return Response.redirect(`${url.origin}/login-client`, 302);
            }
            return new Response(Html_client, {
                headers: { "content-type": "text/html; charset=utf-8" }
            })
        }

        if (url.pathname === "/admin") {
            // Simple Cookie Check
            const cookie = Parameter_request.headers.get("Cookie");
            if (!cookie || !cookie.includes("admin_user=")) {
                return Response.redirect(`${url.origin}/login-admin`, 302);
            }
            return new Response(Html_admin, {
                headers: { "content-type": "text/html; charset=utf-8" }
            })
        }

        // exemple: /put-kv POST {"key": "myKey", "value": "myValue"}
        if (url.pathname === "/put-kv") {
            try {
                const { key, value } = await Parameter_request.json() as { key: string, value: string };
                if (typeof key !== "string" || typeof value !== "string") {
                    return new Response("Invalid key or value. Both must be strings.", { status: 400 });
                }
                await Parameter_env.Kv_portalAlunoGestor.put(key, value);
                return new Response(`Key "${key}" stored successfully.`, { status: 200 });
            }

            catch (e) {
                console.log("Error in /put-kv:", e);
                return new Response("Invalid JSON body. Expected format: {\"key\": \"myKey\", \"value\": \"myValue\"}", { status: 400 });
            }
        }

        // exemple: /get-kv?key=myKey GET
        if (url.pathname === "/get-kv") {
            try {
                const key = url.searchParams.get("key");
                if (!key) {
                    return new Response("Missing 'key' query parameter.", { status: 400 });
                }
                const value = await Parameter_env.Kv_portalAlunoGestor.get(key);
                if (value === null) {
                    return new Response(`Key "${key}" not found.`, { status: 404 });
                }

                return new Response(value, { status: 200 });
            }

            catch (e) {
                console.log("Error in /get-kv:", e);
                return new Response("Error retrieving value from KV.", { status: 500 });
            }
        }

        if (pathname === '/connect-websocket') {
            try {
                const upgradeHeader = Parameter_request.headers.get("Upgrade");
                if (!upgradeHeader || upgradeHeader !== "websocket") {
                    return new Response("Worker expected Upgrade: websocket", {
                    status: 426,
                    });
                }

                if (Parameter_request.method !== "GET") {
                    return new Response("Worker expected GET method", {
                    status: 400,
                    });
                }

                // Since we are hard coding the Durable Object ID by providing the constant name 'foo',
                // all requests to this Worker will be sent to the same Durable Object instance.
                const id = Parameter_env.DurableObject_websocketPortalAlunoGestor.idFromName("foo");
                const stub = Parameter_env.DurableObject_websocketPortalAlunoGestor.get(id);

                return stub.fetch(Parameter_request);
            }

            catch (e) {
                console.log("Error in WebSocket upgrade:", e);
                return new Response(
                    `Supported endpoints: /connect-websocket: Expects a WebSocket upgrade request`,
                    {
                        status: 200,
                        headers: {
                        "Content-Type": "text/plain",
                        },
                    },
                );
            }
        }

        else {
            const Const_assetsPublic = await Parameter_env.Assets_public.fetch(Parameter_request, {
                headers: {
                    "Cache-Control": "no-cache", // para forçar sempre revalidação
                }
            })

            if (Const_assetsPublic.status !== 404) {
                return Const_assetsPublic
            }

            console.log('[/]: [not_found]:', Parameter_request.url)
            return new Response('not found', {status: 404})
        }
    }
}
