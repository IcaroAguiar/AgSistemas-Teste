import { type NextRequest, NextResponse } from "next/server";
import { generateRequestId, logger } from "@/lib/logger";
import { requireAdminAuth } from "@/lib/middleware/auth";
import { AdminIntentionService } from "@/lib/services/admin-intentions";

/**
 * POST /api/admin/intentions/[id]/reject
 * Rejeita uma intenção (admin)
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return requireAdminAuth(async (req) => {
		const requestId = generateRequestId();
		const { id } = await params;

		try {
			const body = await request.json().catch(() => ({}));
			const reason = (body as { reason?: string }).reason;

			await AdminIntentionService.rejectIntention(id, reason);

			logger.info("Intenção rejeitada", {
				requestId,
				intentionId: id,
				reason,
			});

			return new NextResponse(null, { status: 204 });
		} catch (error) {
			if (error instanceof Error && error.message.includes("não encontrada")) {
				return NextResponse.json(
					{
						error: "NotFound",
						message: error.message,
					},
					{ status: 404 },
				);
			}

			if (error instanceof Error && error.message.includes("processada")) {
				return NextResponse.json(
					{
						error: "BadRequest",
						message: error.message,
					},
					{ status: 400 },
				);
			}

			logger.error("Erro ao rejeitar intenção", {
				requestId,
				error: error instanceof Error ? error.message : String(error),
			});

			return NextResponse.json(
				{
					error: "InternalServerError",
					message: "Erro ao processar solicitação",
				},
				{ status: 500 },
			);
		}
	})(request);
}
