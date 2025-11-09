import { type NextRequest, NextResponse } from "next/server";

/**
 * Rotas protegidas que requerem autenticação admin
 */
const protectedRoutes = ["/administracao", "/dashboard"];

/**
 * Verifica se há token válido no cookie ou header
 */
function hasValidToken(request: NextRequest): boolean {
	const ADMIN_TOKEN =
		process.env.ADMIN_TOKEN ??
		(process.env.NODE_ENV === "test"
			? "dev-admin-token-change-in-production"
			: undefined);

	if (!ADMIN_TOKEN) {
		return false;
	}

	// Verificar token no header Authorization (para APIs)
	const authHeader = request.headers.get("authorization");
	if (authHeader) {
		const token = authHeader.startsWith("Bearer ")
			? authHeader.substring(7)
			: authHeader;
		if (token === ADMIN_TOKEN) {
			return true;
		}
	}

	// Verificar token no cookie (para páginas)
	const adminTokenCookie = request.cookies.get("adminToken")?.value;
	if (adminTokenCookie && adminTokenCookie === ADMIN_TOKEN) {
		return true;
	}

	return false;
}

/**
 * Proxy function para proteger rotas privadas no Next.js 16
 * Valida token ADMIN_TOKEN antes de permitir acesso às rotas protegidas
 */
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Verificar se a rota atual é protegida
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (!isProtectedRoute) {
		// Rota pública, continuar normalmente
		return NextResponse.next();
	}

	// Verificar autenticação para rotas protegidas
	const isAuthenticated = hasValidToken(request);

	if (!isAuthenticated) {
		// Token inválido ou ausente - redirecionar para landing page
		// As páginas client-side ainda podem mostrar o formulário de login
		// mas o acesso direto à URL será bloqueado
		const url = request.nextUrl.clone();
		url.pathname = "/";
		url.searchParams.set("unauthorized", "true");
		return NextResponse.redirect(url);
	}

	// Usuário autenticado, continuar
	return NextResponse.next();
}

/**
 * Configuração do matcher para aplicar o proxy apenas nas rotas necessárias
 * Exclui rotas de API, arquivos estáticos e imagens
 */
export const config = {
	matcher: [
		/*
		 * Aplicar apenas em rotas de páginas, excluindo:
		 * - api (rotas de API)
		 * - _next/static (arquivos estáticos)
		 * - _next/image (otimização de imagens)
		 * - favicon.ico, sitemap.xml, robots.txt (arquivos de metadados)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
