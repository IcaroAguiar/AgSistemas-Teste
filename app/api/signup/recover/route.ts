import { NextRequest, NextResponse } from "next/server";
import { SignupService } from "@/lib/services/signup";
import { logger, generateRequestId } from "@/lib/logger";
import { z } from "zod";

const recoverSchema = z.object({
	email: z.string().email("Email inválido"),
});

/**
 * POST /api/signup/recover
 * Recupera link de cadastro por email
 */
export async function POST(request: NextRequest) {
	const requestId = generateRequestId();

	try {
		const body = await request.json();
		const validated = recoverSchema.parse(body);

		const result = await SignupService.recoverSignupLink(validated.email);

		if (!result.found) {
			return NextResponse.json(
				{
					error: "NotFound",
					message: result.reason || "Link não encontrado",
				},
				{ status: 404 },
			);
		}

		logger.info("Link de cadastro recuperado", {
			requestId,
			email: validated.email,
		});

		return NextResponse.json({
			url: result.url,
			expiresAt: result.expiresAt,
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

		logger.error("Erro ao recuperar link de cadastro", {
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

