import { NextRequest, NextResponse } from "next/server";
import { IntentionService } from "@/lib/services/intentions";
import { logger, generateRequestId } from "@/lib/logger";
import { ConflictError } from "@/lib/errors";

/**
 * POST /api/intentions
 * Cria uma nova intenção de participação (público)
 */
export async function POST(request: NextRequest) {
	const requestId = generateRequestId();
	const log = logger.info.bind(logger);

	try {
		const body = await request.json();

		// Criar intenção (o service valida os dados)
		const intention = await IntentionService.createIntention(body);

		log("Intenção criada", {
			requestId,
			intentionId: intention.id,
			email: intention.email,
		});

		return NextResponse.json(
			{
				id: intention.id,
				name: intention.name,
				email: intention.email,
				company: intention.company,
				status: intention.status,
				createdAt: intention.createdAt.toISOString(),
				updatedAt: intention.updatedAt.toISOString(),
			},
			{ status: 201 },
		);
	} catch (error) {
		// Verificar erro de conflito
		if (error instanceof ConflictError) {
			logger.warn("Intenção duplicada", {
				requestId,
				error: error.message,
			});

			return NextResponse.json(
				{
					error: "Conflict",
					message: error.message,
				},
				{ status: 409 },
			);
		}

		// Verificar erro de validação Zod
		if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
			logger.warn("Erro de validação ao criar intenção", {
				requestId,
				error: error instanceof Error ? error.message : String(error),
			});

			return NextResponse.json(
				{
					error: "ValidationError",
					message: "Dados inválidos",
					details: error instanceof Error ? error.message : String(error),
				},
				{ status: 400 },
			);
		}

		logger.error("Erro ao criar intenção", {
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

