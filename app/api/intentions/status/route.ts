import { NextRequest, NextResponse } from "next/server";
import { IntentionService } from "@/lib/services/intentions";
import { SignupService } from "@/lib/services/signup";
import { logger, generateRequestId } from "@/lib/logger";
import { z } from "zod";

const checkStatusSchema = z.object({
	email: z.string().email("Email inválido"),
});

/**
 * POST /api/intentions/status
 * Consulta status da intenção por email (público)
 */
export async function POST(request: NextRequest) {
	const requestId = generateRequestId();

	try {
		const body = await request.json();
		const validated = checkStatusSchema.parse(body);

		const intention = await IntentionService.getIntentionByEmail(validated.email);

		if (!intention) {
			return NextResponse.json(
				{
					error: "NotFound",
					message: "Nenhuma intenção encontrada para este email",
				},
				{ status: 404 },
			);
		}

		// Converter status para lowercase
		const statusMap: Record<string, "pending" | "approved" | "rejected"> = {
			PENDING: "pending",
			APPROVED: "approved",
			REJECTED: "rejected",
		};

		const status = statusMap[intention.status] || "pending";

		// Se aprovada, tentar recuperar/gerar link de cadastro
		let signupUrl: string | null = null;
		if (status === "approved") {
			const recoverResult = await SignupService.recoverSignupLink(validated.email);
			if (recoverResult.found) {
				signupUrl = recoverResult.url;
			}
		}

		logger.info("Status de intenção consultado", {
			requestId,
			email: validated.email,
			status,
		});

		return NextResponse.json({
			status,
			name: intention.name,
			email: intention.email,
			company: intention.company,
			reason: intention.reason,
			signupUrl,
			createdAt: intention.createdAt.toISOString(),
			updatedAt: intention.updatedAt.toISOString(),
		});
	} catch (error) {
		if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
			return NextResponse.json(
				{
					error: "ValidationError",
					message: "Email inválido",
				},
				{ status: 400 },
			);
		}

		logger.error("Erro ao consultar status da intenção", {
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
}

