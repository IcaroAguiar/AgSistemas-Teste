import { NextRequest, NextResponse } from "next/server";
import { AdminIntentionService } from "@/lib/services/admin-intentions";
import { requireAdminAuth } from "@/lib/middleware/auth";
import { logger, generateRequestId } from "@/lib/logger";
import { ConflictError } from "@/lib/errors";

/**
 * GET /api/admin/intentions
 * Lista todas as intenções (admin)
 */
export async function GET(request: NextRequest) {
	return requireAdminAuth(async (req) => {
		const requestId = generateRequestId();

		try {
			const intentions = await AdminIntentionService.listIntentions();

			return NextResponse.json(
				intentions.map((intention) => ({
					id: intention.id,
					name: intention.name,
					email: intention.email,
					company: intention.company,
					status: intention.status,
					reason: intention.reason,
					createdAt: intention.createdAt.toISOString(),
					updatedAt: intention.updatedAt.toISOString(),
					hasInvitation: !!intention.invitation,
				})),
			);
		} catch (error) {
			logger.error("Erro ao listar intenções", {
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

