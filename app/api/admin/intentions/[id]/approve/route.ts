import { type NextRequest, NextResponse } from "next/server";
import { ConflictError } from "@/lib/errors";
import { generateRequestId, logger } from "@/lib/logger";
import { requireAdminAuth } from "@/lib/middleware/auth";
import { AdminIntentionService } from "@/lib/services/admin-intentions";

/**
 * POST /api/admin/intentions/[id]/approve
 * Aprova uma intenção e gera convite (admin)
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return requireAdminAuth(async (req) => {
		const requestId = generateRequestId();
		const { id } = await params;

		try {
			const { token, expiresAt } =
				await AdminIntentionService.approveIntention(id);

			// Em produção, enviar email com token
			// Por enquanto, retornar URL no response
			const baseUrl =
				process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
			const signupUrl = `${baseUrl}/cadastro/${token}`;

			logger.info("Intenção aprovada", {
				requestId,
				intentionId: id,
			});

			return NextResponse.json({
				message: "invitation created",
				url: signupUrl,
				expiresAt,
			});
		} catch (error) {
			if (error instanceof ConflictError) {
				return NextResponse.json(
					{
						error: "Conflict",
						message: error.message,
					},
					{ status: 409 },
				);
			}

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

			logger.error("Erro ao aprovar intenção", {
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
