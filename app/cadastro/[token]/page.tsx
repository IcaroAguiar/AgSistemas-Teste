"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const signupSchema = z.object({
	token: z.string(),
	name: z.string().min(1, "Nome é obrigatório").max(120, "Nome muito longo"),
	email: z.string().email("Email inválido"),
	company: z.string().min(1, "Empresa é obrigatória").max(160, "Nome da empresa muito longo"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function CadastroPage() {
	const params = useParams();
	const router = useRouter();
	const token = params.token as string;

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			token: token || "",
			name: "",
			email: "",
			company: "",
		},
	});

	// Validar token na montagem
	useEffect(() => {
		if (!token) {
			toast.error("Erro", {
				description: "Token não fornecido",
			});
			return;
		}

		const validateToken = async () => {
			try {
				const response = await fetch(`/api/signup/validate?token=${token}`);

				if (!response.ok) {
					const data = await response.json();
					toast.error("Erro na Validação", {
						description: data.reason || data.message || "Token inválido ou expirado",
					});
					return;
				}

				const data = await response.json();

				if (!data.valid) {
					toast.error("Erro na Validação", {
						description: data.reason || "Token inválido",
					});
					return;
				}

				// Pré-preencher formulário com dados da intenção
				if (data.intention) {
					form.reset({
						token,
						name: data.intention.name || "",
						email: data.intention.email || "",
						company: data.intention.company || "",
					});
				}
			} catch (err) {
				toast.error("Erro", {
					description: err instanceof Error ? err.message : "Erro ao validar token",
				});
			}
		};

		validateToken();
	}, [token, form]);

	const onSubmit = async (data: SignupFormData) => {
		try {
			const response = await fetch("/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Erro ao completar cadastro");
			}

			toast.success("Cadastro Concluído!", {
				description: "Seu cadastro foi realizado com sucesso. Redirecionando...",
			});

			// Redirecionar após 2 segundos
			setTimeout(() => {
				router.push("/dashboard");
			}, 2000);
		} catch (err) {
			toast.error("Erro", {
				description: err instanceof Error ? err.message : "Erro desconhecido",
			});
		}
	};

	if (!token) {
		return (
			<main className="flex flex-1 flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
				<section className="mx-auto w-full max-w-2xl">
					<Card>
						<CardHeader>
							<CardTitle>Erro na Validação</CardTitle>
							<CardDescription>
								Não foi possível validar seu token de convite
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button variant="outline" onClick={() => router.push("/")}>
								Voltar para o início
							</Button>
						</CardContent>
					</Card>
				</section>
			</main>
		);
	}

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
				<div className="space-y-4 text-center">
					<h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
						Complete seu Cadastro
					</h1>
					<p className="text-lg text-muted-foreground">
						Preencha os dados abaixo para finalizar sua participação no grupo
					</p>
				</div>

				<Card className="mt-8">
					<CardHeader>
						<CardTitle>Dados do Cadastro</CardTitle>
						<CardDescription>
							Confirme ou atualize suas informações
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FieldSet>
								<FieldGroup>
									<Field data-invalid={!!errors.name}>
										<FieldLabel htmlFor="name">
											Nome Completo <span className="text-destructive">*</span>
										</FieldLabel>
										<Input
											id="name"
											placeholder="Seu nome completo"
											disabled={form.formState.isSubmitting}
											aria-invalid={!!errors.name}
											{...form.register("name")}
										/>
										<FieldError errors={errors.name ? [errors.name] : undefined} />
									</Field>

									<Field data-invalid={!!errors.email}>
										<FieldLabel htmlFor="email">
											Email <span className="text-destructive">*</span>
										</FieldLabel>
										<Input
											id="email"
											type="email"
											placeholder="seu@email.com"
											disabled={form.formState.isSubmitting}
											aria-invalid={!!errors.email}
											{...form.register("email")}
										/>
										<FieldError errors={errors.email ? [errors.email] : undefined} />
									</Field>

									<Field data-invalid={!!errors.company}>
										<FieldLabel htmlFor="company">
											Empresa <span className="text-destructive">*</span>
										</FieldLabel>
										<Input
											id="company"
											placeholder="Nome da sua empresa"
											disabled={form.formState.isSubmitting}
											aria-invalid={!!errors.company}
											{...form.register("company")}
										/>
										<FieldError errors={errors.company ? [errors.company] : undefined} />
									</Field>

									<Field>
										<Button
											type="submit"
											disabled={form.formState.isSubmitting}
											className="w-full"
										>
											{form.formState.isSubmitting
												? "Processando..."
												: "Finalizar Cadastro"}
										</Button>
									</Field>
								</FieldGroup>
							</FieldSet>
						</form>
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
