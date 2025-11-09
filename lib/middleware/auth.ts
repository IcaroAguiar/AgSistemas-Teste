/**
 * Middleware de autenticação para rotas administrativas
 * Valida o token ADMIN_TOKEN do header Authorization
 */

import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

function getAdminToken(): string | null {
    const token =
        process.env.ADMIN_TOKEN ??
        (process.env.NODE_ENV === "test"
            ? "dev-admin-token-change-in-production"
            : undefined);
    if (!token) {
        logger.warn(
            "ADMIN_TOKEN não configurado. Rotas admin exigirão token e retornarão 401.",
        );
    }
    return token ?? null;
}

/**
 * Valida o token de administração do header Authorization
 */
export function validateAdminToken(request: NextRequest): boolean {
	const ADMIN_TOKEN = getAdminToken();
	if (!ADMIN_TOKEN) {
		return false;
	}

	const authHeader = request.headers.get("authorization");

	if (!authHeader) {
		return false;
	}

	// Suporta formato "Bearer TOKEN" ou apenas "TOKEN"
	const token = authHeader.startsWith("Bearer ")
		? authHeader.substring(7)
		: authHeader;

	return token === ADMIN_TOKEN;
}

/**
 * Middleware para proteger rotas administrativas
 * Retorna 401 se o token não for válido
 */
export function requireAdminAuth(
    handler: (request: NextRequest) => Promise<NextResponse>,
) {
    return async (request: NextRequest) => {
        const varyHeader = "Authorization";

        if (!validateAdminToken(request)) {
            logger.warn("Tentativa de acesso não autorizado a rota admin", {
                path: request.nextUrl.pathname,
                method: request.method,
            });

            const res = NextResponse.json(
                { error: "Unauthorized", message: "Token de administração inválido" },
                { status: 401 },
            );
            res.headers.set("Cache-Control", "no-store, private");
            res.headers.set("Vary", varyHeader);
            return res;
        }

        const res = await handler(request);
        // Garantir que respostas privadas não sejam cacheadas e variem por Authorization
        try {
            res.headers.set("Cache-Control", "no-store, private");
            res.headers.set("Vary", varyHeader);
        } catch {
            // ignore if headers already sent / immutable
        }
        return res;
    };
}

/**
 * Helper para extrair o token do header Authorization
 */
export function getAuthToken(request: NextRequest): string | null {
	const authHeader = request.headers.get("authorization");
	if (!authHeader) {
		return null;
	}

	return authHeader.startsWith("Bearer ")
		? authHeader.substring(7)
		: authHeader;
}
