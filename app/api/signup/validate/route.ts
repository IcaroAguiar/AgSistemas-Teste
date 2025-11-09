import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConflictError } from "@/lib/errors";
import { generateRequestId, logger } from "@/lib/logger";
import { SignupService } from "@/lib/services/signup";

const signupSchema = z.object({
	token: z.string(),
	name: z.string().min(1).max(120),
	email: z.string().email(),
	company: z.string().min(1).max(160),
});

/**
 * GET /api/signup/validate?token=...
 * Valida token de convite
 */
export async function GET(request: NextRequest) {
	const requestId = generateRequestId();
	const token = request.nextUrl.searchParams.get("token");

	if (!token) {
		return NextResponse.json(
			{ error: "BadRequest", message: "Token é obrigatório" },
			{ status: 400 },
		);
	}

	try {
		const result = await SignupService.validateToken(token);

		if (!result.valid) {
			return NextResponse.json(
				{ valid: false, reason: result.reason },
				{ status: 400 },
			);
		}

		return NextResponse.json({
			valid: true,
			intention: result.intention,
		});
	} catch (error) {
		logger.error("Erro ao validar token", {
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

/**
 * POST /api/signup
 * Completa cadastro com token
 */
export async function POST(request: NextRequest) {
	const requestId = generateRequestId();

	try {
		const body = await request.json();
		const validated = signupSchema.parse(body);

		const member = await SignupService.completeSignup(validated.token, {
			name: validated.name,
			email: validated.email,
			company: validated.company,
		});

		logger.info("Cadastro completo", {
			requestId,
			memberId: member.id,
		});

		return NextResponse.json(
			{
				id: member.id,
				name: member.name,
				email: member.email,
				company: member.company,
			},
			{ status: 201 },
		);
	} catch (error) {
		if (
			error &&
			typeof error === "object" &&
			"name" in error &&
			error.name === "ZodError"
		) {
			return NextResponse.json(
				{ error: "ValidationError", message: "Dados inválidos" },
				{ status: 400 },
			);
		}

		if (error instanceof ConflictError) {
			return NextResponse.json(
				{ error: "Conflict", message: error.message },
				{ status: 409 },
			);
		}

		if (error instanceof Error && error.message.includes("Token")) {
			return NextResponse.json(
				{ error: "BadRequest", message: error.message },
				{ status: 400 },
			);
		}

		logger.error("Erro ao completar cadastro", {
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
