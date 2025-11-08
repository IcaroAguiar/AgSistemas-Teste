import { NextRequest, NextResponse } from "next/server";
import { MetricsService } from "@/lib/services/metrics";
import { logger, generateRequestId } from "@/lib/logger";

/**
 * GET /api/dashboard
 * Retorna KPIs do mês atual
 */
export async function GET(request: NextRequest) {
	const requestId = generateRequestId();

	try {
		const metrics = await MetricsService.getDashboardMetrics();

		return NextResponse.json(metrics);
	} catch (error) {
		logger.error("Erro ao obter métricas do dashboard", {
			requestId,
			error: error instanceof Error ? error.message : String(error),
		});

		return NextResponse.json(
			{ error: "InternalServerError", message: "Erro ao processar solicitação" },
			{ status: 500 },
		);
	}
}

