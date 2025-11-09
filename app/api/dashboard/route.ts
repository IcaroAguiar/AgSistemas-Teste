import { type NextRequest, NextResponse } from "next/server";
import { generateRequestId, logger } from "@/lib/logger";
import { requireAdminAuth } from "@/lib/middleware/auth";
import { MetricsService } from "@/lib/services/metrics";

// Rota privada: evitar qualquer cache e variar por Authorization
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/dashboard
 * Retorna KPIs do mês atual (privado - requer autenticação admin)
 */
export async function GET(request: NextRequest) {
	return requireAdminAuth(async (req) => {
		const requestId = generateRequestId();

		try {
			const metrics = await MetricsService.getDashboardMetrics();

			const res = NextResponse.json(metrics);
			res.headers.set("Cache-Control", "no-store, private");
			res.headers.set("Vary", "Authorization");
			return res;
		} catch (error) {
			logger.error("Erro ao obter métricas do dashboard", {
				requestId,
				error: error instanceof Error ? error.message : String(error),
			});

			const res = NextResponse.json(
				{
					error: "InternalServerError",
					message: "Erro ao processar solicitação",
				},
				{ status: 500 },
			);
			res.headers.set("Cache-Control", "no-store, private");
			res.headers.set("Vary", "Authorization");
			return res;
		}
	})(request);
}
