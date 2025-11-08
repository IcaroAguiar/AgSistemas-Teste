/**
 * Middleware de autenticação para rotas administrativas
 * Valida o token ADMIN_TOKEN do header Authorization
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
	logger.warn(
		"ADMIN_TOKEN não configurado. Rotas admin não estarão protegidas.",
	);
}

/**
 * Valida o token de administração do header Authorization
 */
export function validateAdminToken(request: NextRequest): boolean {
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
		if (!validateAdminToken(request)) {
			logger.warn("Tentativa de acesso não autorizado a rota admin", {
				path: request.nextUrl.pathname,
				method: request.method,
			});

			return NextResponse.json(
				{ error: "Unauthorized", message: "Token de administração inválido" },
				{ status: 401 },
			);
		}

		return handler(request);
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

