import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { logger } from "@/lib/logger";
import { ConflictError } from "@/lib/errors";

const prisma = new PrismaClient();

/**
 * Service para cadastro de membros via token
 */
export class SignupService {
	/**
	 * Valida token de convite
	 */
	static async validateToken(token: string) {
		const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

		const invitation = await prisma.invitation.findUnique({
			where: { tokenHash },
			include: { intention: true },
		});

		if (!invitation) {
			return { valid: false, reason: "Token inválido" };
		}

		if (invitation.usedAt) {
			return { valid: false, reason: "Token já foi utilizado" };
		}

		if (new Date() > invitation.expiresAt) {
			return { valid: false, reason: "Token expirado" };
		}

		return {
			valid: true,
			intention: {
				name: invitation.intention.name,
				email: invitation.intention.email,
				company: invitation.intention.company,
			},
		};
	}

	/**
	 * Completa cadastro do membro usando token
	 */
	static async completeSignup(
		token: string,
		data: { name: string; email: string; company: string },
	) {
		const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

		const invitation = await prisma.invitation.findUnique({
			where: { tokenHash },
			include: { intention: true },
		});

		if (!invitation) {
			throw new Error("Token inválido");
		}

		if (invitation.usedAt) {
			throw new ConflictError("Token já foi utilizado");
		}

		if (new Date() > invitation.expiresAt) {
			throw new Error("Token expirado");
		}

		// Verificar se email já está em uso
		const existingMember = await prisma.member.findUnique({
			where: { email: data.email },
		});

		if (existingMember) {
			throw new ConflictError("Email já está em uso");
		}

		// Criar membro e marcar convite como usado
		const member = await prisma.member.create({
			data: {
				name: data.name,
				email: data.email,
				company: data.company,
				role: "MEMBER",
				status: "ACTIVE",
				joinedAt: new Date(),
			},
		});

		await prisma.invitation.update({
			where: { id: invitation.id },
			data: { usedAt: new Date() },
		});

		logger.info("Cadastro completo realizado", {
			memberId: member.id,
			email: member.email,
		});

		return member;
	}
}

