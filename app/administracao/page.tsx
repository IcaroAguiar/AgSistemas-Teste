"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type IntentionStatus = "pending" | "approved" | "rejected";

interface Intention {
	id: string;
	name: string;
	email: string;
	company: string;
	motivation: string | null;
	status: IntentionStatus;
	reason: string | null;
	createdAt: string;
	updatedAt: string;
	hasInvitation: boolean;
}

export default function AdministracaoPage() {
	const [adminToken, setAdminToken] = useState("");
	const [intentions, setIntentions] = useState<Intention[]>([]);
	const [filteredIntentions, setFilteredIntentions] = useState<Intention[]>([]);
	const [statusFilter, setStatusFilter] = useState<IntentionStatus | "all">(
		"all",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		intentionId: string;
		action: "approve" | "reject";
		intentionName: string;
	}>({
		open: false,
		intentionId: "",
		action: "approve",
		intentionName: "",
	});

	// Carregar token do localStorage ou cookie se existir
	useEffect(() => {
		const savedToken = localStorage.getItem("adminToken");
		// Também verificar cookie
		const cookieToken = document.cookie
			.split("; ")
			.find((row) => row.startsWith("adminToken="))
			?.split("=")[1];
		const token = savedToken || cookieToken;
		if (token) {
			setAdminToken(token);
			// Garantir que ambos estão sincronizados
			if (savedToken && !cookieToken) {
				document.cookie = `adminToken=${savedToken}; path=/; max-age=86400; SameSite=Lax`;
			}
		}
	}, []);

	// Filtrar intenções quando statusFilter ou intentions mudarem
	useEffect(() => {
		if (statusFilter === "all") {
			setFilteredIntentions(intentions);
		} else {
			const filtered = intentions.filter((intention) => {
				// Garantir que estamos comparando strings em lowercase
				const intentionStatus = intention.status.toLowerCase();
				const filterStatus = statusFilter.toLowerCase();
				return intentionStatus === filterStatus;
			});
			setFilteredIntentions(filtered);
		}
	}, [statusFilter, intentions]);

	const fetchIntentions = async () => {
		if (!adminToken.trim()) {
			setError("Token de administração é obrigatório");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/admin/intentions", {
				headers: {
					Authorization: `Bearer ${adminToken}`,
				},
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Erro ao carregar intenções");
			}

			const data = await response.json();
			setIntentions(data);
			// Salvar token no localStorage e cookie
			localStorage.setItem("adminToken", adminToken);
			// Salvar token em cookie para o proxy validar
			document.cookie = `adminToken=${adminToken}; path=/; max-age=86400; SameSite=Lax`;
			toast.success("Sucesso", {
				description: `${data.length} intenção(ões) carregada(s) com sucesso.`,
			});
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

	const handleApprove = async (intentionId: string) => {
		if (!adminToken.trim()) {
			setError("Token de administração é obrigatório");
			return;
		}

		setActionLoading(intentionId);
		setError(null);

		try {
			const response = await fetch(
				`/api/admin/intentions/${intentionId}/approve`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${adminToken}`,
					},
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Erro ao aprovar intenção");
			}

			const data = await response.json();
			// Recarregar lista
			await fetchIntentions();
			setConfirmDialog({ ...confirmDialog, open: false });

			// Função para copiar URL para clipboard
			const copyToClipboard = async () => {
				try {
					await navigator.clipboard.writeText(data.url);
					toast.success("Copiado!", {
						description: "URL copiada para a área de transferência",
					});
				} catch (err) {
					toast.error("Erro ao copiar", {
						description: "Não foi possível copiar a URL",
					});
				}
			};

			toast.success("Intenção Aprovada!", {
				description: `URL de cadastro gerada: ${data.url}`,
				action: {
					label: "Copiar URL",
					onClick: copyToClipboard,
				},
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro desconhecido";
			setError(errorMessage);
			toast.error("Erro ao Aprovar", {
				description: errorMessage,
			});
		} finally {
			setActionLoading(null);
		}
	};

	const handleReject = async (intentionId: string) => {
		if (!adminToken.trim()) {
			setError("Token de administração é obrigatório");
			return;
		}

		setActionLoading(intentionId);
		setError(null);

		try {
			const response = await fetch(
				`/api/admin/intentions/${intentionId}/reject`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${adminToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ reason: "Rejeitada pelo administrador" }),
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Erro ao rejeitar intenção");
			}

			// Recarregar lista
			await fetchIntentions();
			setConfirmDialog({ ...confirmDialog, open: false });
			toast.success("Intenção Rejeitada", {
				description: "A intenção foi rejeitada com sucesso.",
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Erro desconhecido";
			setError(errorMessage);
			toast.error("Erro ao Rejeitar", {
				description: errorMessage,
			});
		} finally {
			setActionLoading(null);
		}
	};

	const getStatusBadgeVariant = (status: IntentionStatus) => {
		switch (status) {
			case "approved":
				return "default";
			case "rejected":
				return "destructive";
			case "pending":
				return "secondary";
			default:
				return "outline";
		}
	};

	const getStatusLabel = (status: IntentionStatus) => {
		switch (status) {
			case "approved":
				return "Aprovada";
			case "rejected":
				return "Rejeitada";
			case "pending":
				return "Pendente";
			default:
				return status;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

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
							<Link href="/">Voltar ao Início</Link>
						</Button>
					</div>
				</div>
				<div className="mt-6 space-y-4">
					<h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
						Área Administrativa
					</h1>
					<p className="text-lg text-muted-foreground">
						Gerencie intenções de participação e aprovações
					</p>
				</div>

				<div className="mt-8 space-y-6">
					{/* Autenticação */}
					<div className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-end">
							<div className="flex-1 space-y-2">
								<Label htmlFor="adminToken">Token de Administração</Label>
								<Input
									id="adminToken"
									type="password"
									placeholder="Insira o token de administração"
									value={adminToken}
									onChange={(e) => setAdminToken(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											fetchIntentions();
										}
									}}
								/>
							</div>
							<Button onClick={fetchIntentions} disabled={isLoading}>
								{isLoading ? "Carregando..." : "Carregar Intenções"}
							</Button>
						</div>
					</div>

					{/* Erro */}
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* Filtros e Tabela */}
					{intentions.length > 0 && (
						<div className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur">
							<div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<h2 className="text-2xl font-semibold">
									Intenções ({filteredIntentions.length})
								</h2>
								<div className="flex items-center gap-2">
									<Label htmlFor="statusFilter">Filtrar por status:</Label>
									<Select
										value={statusFilter}
										onValueChange={(value) =>
											setStatusFilter(value as IntentionStatus | "all")
										}
									>
										<SelectTrigger id="statusFilter" className="w-[180px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">Todas</SelectItem>
											<SelectItem value="pending">Pendentes</SelectItem>
											<SelectItem value="approved">Aprovadas</SelectItem>
											<SelectItem value="rejected">Rejeitadas</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Nome</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Empresa</TableHead>
											<TableHead>Motivação</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Data de Criação</TableHead>
											<TableHead className="text-right">Ações</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredIntentions.map((intention) => (
											<TableRow key={intention.id}>
												<TableCell className="font-medium">
													{intention.name}
												</TableCell>
												<TableCell>{intention.email}</TableCell>
												<TableCell>{intention.company}</TableCell>
												<TableCell className="max-w-xs">
													{intention.motivation ? (
														<p className="truncate text-sm text-muted-foreground">
															{intention.motivation}
														</p>
													) : (
														<span className="text-sm text-muted-foreground italic">
															Não informado
														</span>
													)}
												</TableCell>
												<TableCell>
													<Badge
														variant={
															getStatusBadgeVariant(intention.status) as
																| "default"
																| "destructive"
																| "secondary"
																| "outline"
														}
													>
														{getStatusLabel(intention.status)}
													</Badge>
												</TableCell>
												<TableCell>{formatDate(intention.createdAt)}</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														{intention.status.toLowerCase() === "pending" && (
															<>
																<Button
																	size="sm"
																	variant="default"
																	onClick={() =>
																		setConfirmDialog({
																			open: true,
																			intentionId: intention.id,
																			action: "approve",
																			intentionName: intention.name,
																		})
																	}
																	disabled={actionLoading === intention.id}
																>
																	{actionLoading === intention.id
																		? "Processando..."
																		: "Aprovar"}
																</Button>
																<Button
																	size="sm"
																	variant="destructive"
																	onClick={() =>
																		setConfirmDialog({
																			open: true,
																			intentionId: intention.id,
																			action: "reject",
																			intentionName: intention.name,
																		})
																	}
																	disabled={actionLoading === intention.id}
																>
																	{actionLoading === intention.id
																		? "Processando..."
																		: "Recusar"}
																</Button>
															</>
														)}
														{intention.status.toLowerCase() !== "pending" && (
															<span className="text-sm text-muted-foreground">
																Processada
															</span>
														)}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					)}

					{/* Loading skeleton */}
					{isLoading && intentions.length === 0 && (
						<div className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur">
							<div className="space-y-4">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					)}

					{/* Mensagem quando não há intenções */}
					{!isLoading && intentions.length === 0 && adminToken && !error && (
						<div className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur">
							<p className="text-center text-muted-foreground">
								Nenhuma intenção encontrada.
							</p>
						</div>
					)}
				</div>
			</section>

			{/* Dialog de confirmação */}
			<Dialog
				open={confirmDialog.open}
				onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{confirmDialog.action === "approve"
								? "Aprovar Intenção"
								: "Rejeitar Intenção"}
						</DialogTitle>
						<DialogDescription>
							Tem certeza que deseja{" "}
							{confirmDialog.action === "approve" ? "aprovar" : "rejeitar"} a
							intenção de <strong>{confirmDialog.intentionName}</strong>?
							{confirmDialog.action === "approve" &&
								" Um link de cadastro será gerado."}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() =>
								setConfirmDialog({ ...confirmDialog, open: false })
							}
						>
							Cancelar
						</Button>
						<Button
							variant={
								confirmDialog.action === "approve" ? "default" : "destructive"
							}
							onClick={() => {
								if (confirmDialog.action === "approve") {
									handleApprove(confirmDialog.intentionId);
								} else {
									handleReject(confirmDialog.intentionId);
								}
							}}
							disabled={actionLoading === confirmDialog.intentionId}
						>
							{actionLoading === confirmDialog.intentionId
								? "Processando..."
								: confirmDialog.action === "approve"
									? "Aprovar"
									: "Rejeitar"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
}
