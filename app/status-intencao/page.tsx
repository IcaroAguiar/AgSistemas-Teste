"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, ExternalLink, Clock, CheckCircle2, XCircle } from "lucide-react";
import { z } from "zod";
import Link from "next/link";

const statusSchema = z.object({
	email: z.string().email("Email inválido"),
});

type StatusFormData = z.infer<typeof statusSchema>;

type IntentionStatus = "pending" | "approved" | "rejected";

interface IntentionStatusResult {
	status: IntentionStatus;
	name: string;
	email: string;
	company: string;
	reason: string | null;
	signupUrl: string | null;
	createdAt: string;
	updatedAt: string;
}

export default function StatusIntencaoPage() {
	const [statusResult, setStatusResult] = useState<IntentionStatusResult | null>(null);
	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<StatusFormData>({
		resolver: zodResolver(statusSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: StatusFormData) => {
		setIsLoading(true);
		setStatusResult(null);
		setCopied(false);

		try {
			const response = await fetch("/api/intentions/status", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Erro ao consultar status");
			}

			setStatusResult(result);
			toast.success("Status encontrado!", {
				description: "Sua intenção foi localizada com sucesso.",
			});
		} catch (err) {
			toast.error("Erro", {
				description: err instanceof Error ? err.message : "Erro desconhecido",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast.success("Copiado!", {
				description: "Link copiado para a área de transferência",
			});
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			toast.error("Erro ao copiar", {
				description: "Não foi possível copiar o link",
			});
		}
	};

	const getStatusBadge = (status: IntentionStatus) => {
		switch (status) {
			case "approved":
				return (
					<Badge variant="default" className="gap-2">
						<CheckCircle2 className="h-3 w-3" />
						Aprovada
					</Badge>
				);
			case "rejected":
				return (
					<Badge variant="destructive" className="gap-2">
						<XCircle className="h-3 w-3" />
						Rejeitada
					</Badge>
				);
			case "pending":
			default:
				return (
					<Badge variant="secondary" className="gap-2">
						<Clock className="h-3 w-3" />
						Pendente
					</Badge>
				);
		}
	};

	const getStatusMessage = (status: IntentionStatus) => {
		switch (status) {
			case "approved":
				return "Parabéns! Sua intenção foi aprovada. Use o link abaixo para completar seu cadastro.";
			case "rejected":
				return "Sua intenção foi rejeitada. Entre em contato com a administração para mais informações.";
			case "pending":
			default:
				return "Sua intenção está aguardando análise pela administração. Você será notificado quando houver uma atualização.";
		}
	};

	const errors = form.formState.errors;

	return (
		<main className="flex flex-1 flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
			<section className="mx-auto w-full max-w-2xl">
				<div className="mb-4">
					<Button variant="ghost" asChild>
						<Link href="/">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Voltar ao Início
						</Link>
					</Button>
				</div>
				<div className="space-y-4">
					<h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
						Status da Minha Intenção
					</h1>
					<p className="text-lg text-muted-foreground">
						Digite seu email para consultar o status da sua intenção de participação
					</p>
				</div>

				<div className="mt-8 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur">
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FieldSet>
							<FieldGroup>
								<Field data-invalid={!!errors.email}>
									<FieldLabel htmlFor="email">
										Email <span className="text-destructive">*</span>
									</FieldLabel>
									<Input
										id="email"
										type="email"
										placeholder="seu@email.com"
										disabled={form.formState.isSubmitting || isLoading}
										aria-invalid={!!errors.email}
										{...form.register("email")}
									/>
									<FieldError errors={errors.email ? [errors.email] : undefined} />
								</Field>

								<Field>
									<Button
										type="submit"
										disabled={form.formState.isSubmitting || isLoading}
										size="lg"
										className="w-full"
									>
										{isLoading ? "Consultando..." : "Consultar Status"}
									</Button>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>

					{statusResult && (
						<div className="mt-6 space-y-4">
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Status da Intenção</CardTitle>
										{getStatusBadge(statusResult.status)}
									</div>
									<CardDescription>{getStatusMessage(statusResult.status)}</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-2 text-sm">
										<div>
											<span className="font-medium text-muted-foreground">Nome:</span>{" "}
											<span className="text-foreground">{statusResult.name}</span>
										</div>
										<div>
											<span className="font-medium text-muted-foreground">Email:</span>{" "}
											<span className="text-foreground">{statusResult.email}</span>
										</div>
										<div>
											<span className="font-medium text-muted-foreground">Empresa:</span>{" "}
											<span className="text-foreground">{statusResult.company}</span>
										</div>
										<div>
											<span className="font-medium text-muted-foreground">
												Data de envio:
											</span>{" "}
											<span className="text-foreground">
												{new Date(statusResult.createdAt).toLocaleDateString("pt-BR", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									</div>

									{statusResult.reason && statusResult.status === "rejected" && (
										<Alert variant="destructive">
											<AlertDescription>
												<strong>Motivo da rejeição:</strong> {statusResult.reason}
											</AlertDescription>
										</Alert>
									)}

									{statusResult.status === "approved" && statusResult.signupUrl && (
										<div className="space-y-3">
											<div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
												<p className="text-sm font-medium mb-2">
													Link de Cadastro:
												</p>
												<div className="flex items-center gap-2">
													<div className="flex-1 min-w-0">
														<p className="text-sm font-mono break-all text-foreground">
															{statusResult.signupUrl}
														</p>
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() => copyToClipboard(statusResult.signupUrl!)}
														className="shrink-0"
													>
														{copied ? (
															<>
																<Check className="h-4 w-4 mr-2" />
																Copiado
															</>
														) : (
															<>
																<Copy className="h-4 w-4 mr-2" />
																Copiar
															</>
														)}
													</Button>
													<Button
														variant="default"
														size="sm"
														asChild
														className="shrink-0"
													>
														<Link href={statusResult.signupUrl} target="_blank">
															<ExternalLink className="h-4 w-4 mr-2" />
															Acessar
														</Link>
													</Button>
												</div>
											</div>
											<Alert>
												<AlertDescription>
													<strong>Importante:</strong> Este link expira em 7 dias.
													Complete seu cadastro o quanto antes.
												</AlertDescription>
											</Alert>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}

