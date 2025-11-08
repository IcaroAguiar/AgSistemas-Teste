/**
 * Helper para testar Next.js App Router API Routes
 * Usa uma abordagem mais simples: testa diretamente os handlers
 */

import { NextRequest } from "next/server";

/**
 * Cria um mock do Next.js Request para testes
 */
export function createMockRequest(
	method: string = "GET",
	path: string = "/",
	body?: unknown,
	headers: Record<string, string> = {},
): NextRequest {
	const url = `http://localhost${path}`;
	
	const requestHeaders = new Headers(headers);
	if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
		requestHeaders.set("Content-Type", "application/json");
	}

	return new NextRequest(url, {
		method,
		headers: requestHeaders,
		body: body && (method === "POST" || method === "PUT" || method === "PATCH")
			? JSON.stringify(body)
			: undefined,
	});
}

/**
 * Helper para extrair JSON da Response
 */
export async function getJsonResponse(response: Response): Promise<unknown> {
	const text = await response.text();
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

