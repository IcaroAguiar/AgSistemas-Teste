import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Service para métricas e dashboards
 */
export class MetricsService {
	/**
	 * Obtém KPIs do mês atual
	 */
	static async getDashboardMetrics() {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		const [membrosAtivos, indicacoesNoMes, obrigadosNoMes] = await Promise.all([
			// Membros ativos
			prisma.member.count({
				where: {
					status: "ACTIVE",
				},
			}),

			// Indicações no mês
			prisma.referral.count({
				where: {
					createdAt: {
						gte: startOfMonth,
					},
				},
			}),

			// Obrigados no mês
			prisma.gratitude.count({
				where: {
					createdAt: {
						gte: startOfMonth,
					},
				},
			}),
		]);

		return {
			membrosAtivos,
			indicacoesNoMes,
			obrigadosNoMes,
		};
	}

	/**
	 * Obtém relatórios por período
	 */
	static async getReports(period: "weekly" | "monthly" | "total") {
		const now = new Date();
		let startDate: Date;

		if (period === "weekly") {
			startDate = new Date(now);
			startDate.setDate(startDate.getDate() - 7);
		} else if (period === "monthly") {
			startDate = new Date(now.getFullYear(), now.getMonth(), 1);
		} else {
			startDate = new Date(0); // Desde o início
		}

		const [membrosAtivos, indicacoes, obrigados] = await Promise.all([
			prisma.member.count({
				where: {
					status: "ACTIVE",
					...(period !== "total" && {
						joinedAt: {
							gte: startDate,
						},
					}),
				},
			}),

			prisma.referral.count({
				where: {
					createdAt: {
						gte: startDate,
					},
				},
			}),

			prisma.gratitude.count({
				where: {
					createdAt: {
						gte: startDate,
					},
				},
			}),
		]);

		return {
			period,
			membrosAtivos,
			indicacoes,
			obrigados,
		};
	}
}

