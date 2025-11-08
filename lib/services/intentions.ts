import { PrismaClient } from "@prisma/client";
import { createIntentionSchema, type CreateIntentionInput } from "@/lib/validation/intentions";
import { logger } from "@/lib/logger";
import { ConflictError } from "@/lib/errors";

const prisma = new PrismaClient();

/**
 * Service para gerenciar intenções de participação
 */
export class IntentionService {
	/**
	 * Cria uma nova intenção de participação
	 */
	static async createIntention(data: CreateIntentionInput) {
		// Validar dados de entrada
		const validated = createIntentionSchema.parse(data);

		// Verificar se já existe uma intenção pendente com o mesmo email
		const existing = await prisma.intention.findFirst({
			where: {
				email: validated.email,
				status: "PENDING",
			},
		});

		if (existing) {
			logger.warn("Intenção já existe para este email", {
				email: validated.email,
				intentionId: existing.id,
			});
			throw new ConflictError("Já existe uma intenção pendente para este email");
		}

		// Criar intenção
		const intention = await prisma.intention.create({
			data: {
				name: validated.name,
				email: validated.email,
				company: validated.company,
				status: "PENDING",
			},
		});

		logger.info("Intenção criada com sucesso", {
			intentionId: intention.id,
			email: intention.email,
		});

		return intention;
	}

	/**
	 * Lista todas as intenções (para admin)
	 */
	static async listIntentions() {
		const intentions = await prisma.intention.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

		return intentions;
	}

	/**
	 * Busca uma intenção por ID
	 */
	static async getIntentionById(id: string) {
		const intention = await prisma.intention.findUnique({
			where: { id },
			include: {
				invitation: true,
			},
		});

		return intention;
	}
}

