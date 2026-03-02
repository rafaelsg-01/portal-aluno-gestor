import { DurableObject } from "cloudflare:workers";
import { Request, WebSocket } from "@cloudflare/workers-types";
import { Type_envData } from "./types";


// Durable Object
export class Class_WebsocketNotificacaoTest extends DurableObject {
  constructor(ctx: DurableObjectState, env: Type_envData) {
    super(ctx, env);
    // Mantém a conexão viva com pings automáticos
    this.ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong"),
    );
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/connect-websocket") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      // Aceita o WebSocket. A API de Hibernação gerencia a lista de sockets automaticamente.
      this.ctx.acceptWebSocket(server);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    return new Response("Not found. Use /connect-websocket", { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    // Regra simples e anárquica: recebeu -> mandou pra todo mundo (menos pro remetente para evitar eco)
    this.ctx.getWebSockets().forEach((client) => {
      if (client !== ws) {
        try {
          client.send(message);
        } catch (err) {
          // Ignora erros de envio
        }
      }
    });
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    // Nada a fazer, a Cloudflare remove da lista automaticamente
  }
}