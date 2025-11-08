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
		const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

		const [
			membrosAtivos,
			indicacoesNoMes,
			obrigadosNoMes,
			membrosAtivosMesAnterior,
			indicacoesMesAnterior,
			obrigadosMesAnterior,
			totalIndicacoes,
			totalObrigados,
			membrosInativos,
		] = await Promise.all([
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

			// Membros ativos no mês anterior (para comparação)
			// Contar membros que estavam ativos até o final do mês anterior
			prisma.member.count({
				where: {
					status: "ACTIVE",
					joinedAt: {
						lte: endOfLastMonth,
					},
				},
			}),

			// Indicações no mês anterior
			prisma.referral.count({
				where: {
					createdAt: {
						gte: startOfLastMonth,
						lt: startOfMonth,
					},
				},
			}),

			// Obrigados no mês anterior
			prisma.gratitude.count({
				where: {
					createdAt: {
						gte: startOfLastMonth,
						lt: startOfMonth,
					},
				},
			}),

			// Total de indicações (histórico)
			prisma.referral.count(),

			// Total de obrigados (histórico)
			prisma.gratitude.count(),

			// Membros inativos
			prisma.member.count({
				where: {
					status: "INACTIVE",
				},
			}),
		]);

		// Calcular variações percentuais
		const calcularVariacao = (atual: number, anterior: number) => {
			if (anterior === 0) return atual > 0 ? 100 : 0;
			return Math.round(((atual - anterior) / anterior) * 100);
		};

		return {
			membrosAtivos,
			indicacoesNoMes,
			obrigadosNoMes,
			membrosInativos,
			totalIndicacoes,
			totalObrigados,
			variacoes: {
				membrosAtivos: calcularVariacao(membrosAtivos, membrosAtivosMesAnterior),
				indicacoes: calcularVariacao(indicacoesNoMes, indicacoesMesAnterior),
				obrigados: calcularVariacao(obrigadosNoMes, obrigadosMesAnterior),
			},
			mesAnterior: {
				membrosAtivos: membrosAtivosMesAnterior,
				indicacoes: indicacoesMesAnterior,
				obrigados: obrigadosMesAnterior,
			},
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

