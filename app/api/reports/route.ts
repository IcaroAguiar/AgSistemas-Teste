import { NextRequest, NextResponse } from "next/server";
import { MetricsService } from "@/lib/services/metrics";
import { logger, generateRequestId } from "@/lib/logger";

/**
 * GET /api/reports?period=weekly|monthly|total
 * Retorna relatórios por período
 */
export async function GET(request: NextRequest) {
	const requestId = generateRequestId();
	const period = request.nextUrl.searchParams.get("period") as
		| "weekly"
		| "monthly"
		| "total"
		| null;

	if (!period || !["weekly", "monthly", "total"].includes(period)) {
		return NextResponse.json(
			{
				error: "BadRequest",
				message: "Período inválido. Use: weekly, monthly ou total",
			},
			{ status: 400 },
		);
	}

	try {
		const reports = await MetricsService.getReports(period);

		return NextResponse.json(reports);
	} catch (error) {
		logger.error("Erro ao obter relatórios", {
			requestId,
			error: error instanceof Error ? error.message : String(error),
		});

		return NextResponse.json(
			{ error: "InternalServerError", message: "Erro ao processar solicitação" },
			{ status: 500 },
		);
	}
}

