"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Copy, Check } from "lucide-react";

const recoverSchema = z.object({
	email: z.string().email("Email inválido"),
});

type RecoverFormData = z.infer<typeof recoverSchema>;

export default function RecuperarLinkPage() {
	const [recoveredUrl, setRecoveredUrl] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const form = useForm<RecoverFormData>({
		resolver: zodResolver(recoverSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: RecoverFormData) => {
		try {
			const response = await fetch("/api/signup/recover", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Erro ao recuperar link");
			}

			setRecoveredUrl(result.url);
			toast.success("Link recuperado!", {
				description: "Seu link de cadastro foi recuperado com sucesso.",
			});
		} catch (err) {
			toast.error("Erro", {
				description: err instanceof Error ? err.message : "Erro desconhecido",
			});
		}
	};

	const copyToClipboard = async () => {
		if (!recoveredUrl) return;

		try {
			await navigator.clipboard.writeText(recoveredUrl);
			setCopied(true);
			toast.success("Copiado!", {
				description: "URL copiada para a área de transferência",
			});
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			toast.error("Erro ao copiar", {
				description: "Não foi possível copiar a URL",
			});
		}
	};

	const errors = form.formState.errors;

	return (
		<main className="flex flex-1 flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
			<section className="mx-auto w-full max-w-2xl">
				<div className="space-y-4">
					<h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
						Recuperar Link de Cadastro
					</h1>
					<p className="text-lg text-muted-foreground">
						Digite seu email para recuperar o link de cadastro
					</p>
				</div>

				<div className="mt-8 rounded-2xl border border-white/10 bg-card/70 p-6 backdrop-blur">
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
										disabled={form.formState.isSubmitting}
										aria-invalid={!!errors.email}
										{...form.register("email")}
									/>
									<FieldError errors={errors.email ? [errors.email] : undefined} />
								</Field>

								<Field>
									<Button
										type="submit"
										disabled={form.formState.isSubmitting}
										size="lg"
										className="w-full"
									>
										{form.formState.isSubmitting
											? "Recuperando..."
											: "Recuperar Link"}
									</Button>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>

					{recoveredUrl && (
						<div className="mt-6 space-y-4">
							<div className="rounded-lg border border-white/10 bg-background/50 p-4">
								<div className="flex items-center justify-between gap-4">
									<div className="flex-1 min-w-0">
										<p className="text-sm text-muted-foreground mb-1">
											Seu link de cadastro:
										</p>
										<p className="text-sm font-mono break-all text-foreground">
											{recoveredUrl}
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={copyToClipboard}
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
								</div>
							</div>
							<div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
								<p className="text-sm text-muted-foreground">
									<strong>Importante:</strong> Este link expira em 7 dias. Guarde-o
									em local seguro ou complete seu cadastro o quanto antes.
								</p>
							</div>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}

