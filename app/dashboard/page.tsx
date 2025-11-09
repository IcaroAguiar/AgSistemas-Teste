"use client";

import {
	ArrowDownRight,
	ArrowUpRight,
	Handshake,
	Heart,
	Home,
	Minus,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardMetrics {
	membrosAtivos: number;
	indicacoesNoMes: number;
	obrigadosNoMes: number;
	membrosInativos: number;
	totalIndicacoes: number;
	totalObrigados: number;
	variacoes: {
		membrosAtivos: number;
		indicacoes: number;
		obrigados: number;
	};
	mesAnterior: {
		membrosAtivos: number;
		indicacoes: number;
		obrigados: number;
	};
}

export default function DashboardPage() {
	const [adminToken, setAdminToken] = useState("");
	const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Carregar token do localStorage se existir
	useEffect(() => {
		const savedToken = localStorage.getItem("adminToken");
		if (savedToken) {
			setAdminToken(savedToken);
			setIsAuthenticated(true);
		}
	}, []);

	useEffect(() => {
		if (isAuthenticated && adminToken) {
			fetchMetrics();
		}
	}, [isAuthenticated, adminToken]);

	const fetchMetrics = async () => {
		if (!adminToken.trim()) {
			setError("Token de administração é obrigatório");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/dashboard", {
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					setIsAuthenticated(false);
					setError("Token inválido ou expirado");
					toast.error("Erro de Autenticação", {
						description: "Token inválido. Por favor, faça login novamente.",
					});
					return;
				}
				const data = await response.json();
				throw new Error(data.message || "Erro ao carregar métricas");
			}

			const data = await response.json();
			setMetrics(data);
			localStorage.setItem("adminToken", adminToken);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro desconhecido";
			setError(errorMessage);
			toast.error("Erro", {
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogin = () => {
		if (!adminToken.trim()) {
			setError("Token de administração é obrigatório");
			return;
		}
		setIsAuthenticated(true);
		fetchMetrics();
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat("pt-BR").format(num);
	};

	const formatPercent = (num: number) => {
		const sign = num >= 0 ? "+" : "";
		return `${sign}${num}%`;
	};

	const getVariationBadge = (variation: number) => {
		if (variation > 0) {
			return (
				<Badge
					variant="default"
					className="gap-1 bg-green-600 hover:bg-green-700"
				>
					<ArrowUpRight className="h-3 w-3" />
					{formatPercent(variation)}
				</Badge>
			);
		}
		if (variation < 0) {
			return (
				<Badge variant="destructive" className="gap-1">
					<ArrowDownRight className="h-3 w-3" />
					{formatPercent(variation)}
				</Badge>
			);
		}
		return (
			<Badge variant="secondary" className="gap-1">
				<Minus className="h-3 w-3" />
				0%
			</Badge>
		);
	};

	const calcularTaxaConversao = () => {
		if (!metrics || metrics.totalIndicacoes === 0) return 0;
		return Math.round((metrics.totalObrigados / metrics.totalIndicacoes) * 100);
	};

	const calcularTaxaAtividade = () => {
		if (!metrics || metrics.membrosAtivos === 0) return 0;
		const totalMembros = metrics.membrosAtivos + metrics.membrosInativos;
		if (totalMembros === 0) return 0;
		return Math.round((metrics.membrosAtivos / totalMembros) * 100);
	};

	// Tela de autenticação
	if (!isAuthenticated) {
		return (
			<main className="flex flex-1 flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
				<section className="mx-auto w-full max-w-md">
					<div className="space-y-4">
						<h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
							Dashboard
						</h1>
						<p className="text-lg text-muted-foreground">
							Área privada - Autenticação necessária
						</p>
					</div>

					<div className="mt-8 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur">
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="dashboardToken">Token de Administração</Label>
								<Input
									id="dashboardToken"
									type="password"
									placeholder="Insira o token de administração"
									value={adminToken}
									onChange={(e) => setAdminToken(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleLogin();
										}
									}}
								/>
							</div>
							<Button
								onClick={handleLogin}
								disabled={isLoading}
								className="w-full"
							>
								{isLoading ? "Carregando..." : "Acessar Dashboard"}
							</Button>
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
						</div>
					</div>

					<div className="mt-6 text-center">
						<Button variant="ghost" asChild>
							<Link href="/">
								<Home className="h-4 w-4 mr-2" />
								Voltar ao Início
							</Link>
						</Button>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="flex flex-1 flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
			<section className="mx-auto w-full max-w-7xl">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-4">
						<Logo width={64} height={64} showText />
					</div>
					<div className="flex items-center gap-2">
						<ThemeToggle />
						<Button variant="outline" asChild>
							<Link href="/">
								<Home className="h-4 w-4 mr-2" />
								Voltar ao Início
							</Link>
						</Button>
					</div>
				</div>
				<div className="mt-6 space-y-4">
					<h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
						Dashboard
					</h1>
					<p className="text-lg text-muted-foreground">
						Visão geral das métricas do mês atual
					</p>
				</div>

				{error && (
					<div className="mt-8">
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					</div>
				)}

				{isLoading ? (
					<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{[...Array(6)].map((_, i) => (
							<Card key={i}>
								<CardHeader>
									<Skeleton className="h-6 w-32" />
									<Skeleton className="h-4 w-24" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-12 w-24" />
								</CardContent>
							</Card>
						))}
					</div>
				) : metrics ? (
					<>
						{/* KPIs Principais */}
						<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							<Card className="relative overflow-hidden">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Membros Ativos
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-primary">
										{formatNumber(metrics.membrosAtivos)}
									</div>
									<div className="flex items-center gap-2 mt-2">
										{getVariationBadge(metrics.variacoes.membrosAtivos)}
										<p className="text-xs text-muted-foreground">
											vs. mês anterior (
											{formatNumber(metrics.mesAnterior.membrosAtivos)})
										</p>
									</div>
									{metrics.membrosInativos > 0 && (
										<div className="mt-3">
											<p className="text-xs text-muted-foreground mb-1">
												Membros inativos:{" "}
												{formatNumber(metrics.membrosInativos)}
											</p>
											<Progress
												value={calcularTaxaAtividade()}
												className="h-2"
											/>
										</div>
									)}
								</CardContent>
							</Card>

							<Card className="relative overflow-hidden">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Indicações no Mês
									</CardTitle>
									<Handshake className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-primary">
										{formatNumber(metrics.indicacoesNoMes)}
									</div>
									<div className="flex items-center gap-2 mt-2">
										{getVariationBadge(metrics.variacoes.indicacoes)}
										<p className="text-xs text-muted-foreground">
											vs. mês anterior (
											{formatNumber(metrics.mesAnterior.indicacoes)})
										</p>
									</div>
									<div className="mt-3">
										<p className="text-xs text-muted-foreground mb-1">
											Total histórico: {formatNumber(metrics.totalIndicacoes)}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="relative overflow-hidden">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Obrigados no Mês
									</CardTitle>
									<Heart className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-primary">
										{formatNumber(metrics.obrigadosNoMes)}
									</div>
									<div className="flex items-center gap-2 mt-2">
										{getVariationBadge(metrics.variacoes.obrigados)}
										<p className="text-xs text-muted-foreground">
											vs. mês anterior (
											{formatNumber(metrics.mesAnterior.obrigados)})
										</p>
									</div>
									<div className="mt-3">
										<p className="text-xs text-muted-foreground mb-1">
											Total histórico: {formatNumber(metrics.totalObrigados)}
										</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Métricas Adicionais */}
						<div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle className="text-sm font-medium">
										Taxa de Conversão
									</CardTitle>
									<CardDescription>
										Indicações que resultaram em obrigados
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-primary">
										{calcularTaxaConversao()}%
									</div>
									<div className="mt-3">
										<Progress value={calcularTaxaConversao()} className="h-2" />
									</div>
									<p className="text-xs text-muted-foreground mt-2">
										{formatNumber(metrics.totalObrigados)} de{" "}
										{formatNumber(metrics.totalIndicacoes)} indicações
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-sm font-medium">
										Taxa de Atividade
									</CardTitle>
									<CardDescription>
										Percentual de membros ativos
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-primary">
										{calcularTaxaAtividade()}%
									</div>
									<div className="mt-3">
										<Progress value={calcularTaxaAtividade()} className="h-2" />
									</div>
									<p className="text-xs text-muted-foreground mt-2">
										{formatNumber(metrics.membrosAtivos)} de{" "}
										{formatNumber(
											metrics.membrosAtivos + metrics.membrosInativos,
										)}{" "}
										membros
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="text-sm font-medium">
										Média de Indicações
									</CardTitle>
									<CardDescription>Por membro ativo no mês</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-primary">
										{metrics.membrosAtivos > 0
											? (
													metrics.indicacoesNoMes / metrics.membrosAtivos
												).toFixed(1)
											: "0.0"}
									</div>
									<p className="text-xs text-muted-foreground mt-2">
										{formatNumber(metrics.indicacoesNoMes)} indicações ÷{" "}
										{formatNumber(metrics.membrosAtivos)} membros
									</p>
								</CardContent>
							</Card>
						</div>
					</>
				) : null}
			</section>
		</main>
	);
}
