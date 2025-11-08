import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";
import { ConflictError } from "@/lib/errors";
import crypto from "crypto";

const prisma = new PrismaClient();

/**
 * Service para administração de intenções
 */
export class AdminIntentionService {
	/**
	 * Lista todas as intenções
	 */
	static async listIntentions() {
		const intentions = await prisma.intention.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				invitation: true,
			},
		});

		return intentions;
	}

	/**
	 * Aprova uma intenção e gera convite
	 */
	static async approveIntention(intentionId: string) {
		const intention = await prisma.intention.findUnique({
			where: { id: intentionId },
			include: { invitation: true },
		});

		if (!intention) {
			throw new Error("Intenção não encontrada");
		}

		if (intention.status !== "PENDING") {
			throw new Error("Intenção já foi processada");
		}

		if (intention.invitation) {
			throw new ConflictError("Convite já foi gerado para esta intenção");
		}

		// Gerar token aleatório
		const token = crypto.randomBytes(32).toString("hex");
		const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

		// Criar convite (expira em 7 dias)
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		await prisma.intention.update({
			where: { id: intentionId },
			data: {
				status: "APPROVED",
				invitation: {
					create: {
						tokenHash,
						expiresAt,
					},
				},
			},
		});

		logger.info("Intenção aprovada e convite gerado", {
			intentionId,
			expiresAt: expiresAt.toISOString(),
		});

		// Retornar token (em produção, enviar por email)
		return {
			token,
			expiresAt: expiresAt.toISOString(),
		};
	}

	/**
	 * Rejeita uma intenção
	 */
	static async rejectIntention(intentionId: string, reason?: string) {
		const intention = await prisma.intention.findUnique({
			where: { id: intentionId },
		});

		if (!intention) {
			throw new Error("Intenção não encontrada");
		}

		if (intention.status !== "PENDING") {
			throw new Error("Intenção já foi processada");
		}

		await prisma.intention.update({
			where: { id: intentionId },
			data: {
				status: "REJECTED",
				reason,
			},
		});

		logger.info("Intenção rejeitada", {
			intentionId,
			reason,
		});
	}
}

