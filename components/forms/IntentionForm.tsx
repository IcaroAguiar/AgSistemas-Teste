"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
	type CreateIntentionInput,
	createIntentionSchema,
} from "@/lib/validation/intentions";

export function IntentionForm() {
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [instantSubmitting, setInstantSubmitting] = useState(false);
	const form = useForm<CreateIntentionInput>({
		resolver: zodResolver(createIntentionSchema),
		defaultValues: {
			name: "",
			email: "",
			company: "",
			motivation: "",
		},
	});

	const onSubmit = async (data: CreateIntentionInput) => {
		try {
			// Enviar motivation apenas quando preenchida para manter contrato esperado nos testes
			const payload = {
				name: data.name,
				email: data.email,
				company: data.company,
				...(data.motivation ? { motivation: data.motivation } : {}),
			};
			const response = await fetch("/api/intentions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Erro ao enviar intenção");
			}

			form.reset();
			setSuccessMessage(
				"Intenção enviada com sucesso! Aguarde o contato da administração.",
			);
			toast.success("Sucesso!", {
				description:
					"Intenção enviada com sucesso! Aguarde o contato da administração.",
			});
		} catch (err) {
			setSuccessMessage(null);
			toast.error("Erro", {
				description: err instanceof Error ? err.message : "Erro desconhecido",
			});
		} finally {
			setInstantSubmitting(false);
		}
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const isValid = await form.trigger();
		if (!isValid) {
			return;
		}
		setInstantSubmitting(true);
		const data = form.getValues();
		await onSubmit(data);
	};

	const errors = form.formState.errors;

	return (
		<form noValidate onSubmit={handleFormSubmit}>
			<FieldSet>
				<FieldGroup>
					<Field data-invalid={!!errors.name}>
						<FieldLabel htmlFor="name">
							Nome completo <span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							id="name"
							placeholder="Seu nome completo"
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
						<FieldError
							errors={errors.company ? [errors.company] : undefined}
						/>
					</Field>

					<Field data-invalid={!!errors.motivation}>
						<FieldLabel htmlFor="motivation">
							Por que você quer participar?
						</FieldLabel>
						<Textarea
							id="motivation"
							placeholder="Conte-nos um pouco sobre seus motivos para participar do grupo..."
							disabled={form.formState.isSubmitting}
							aria-invalid={!!errors.motivation}
							className="min-h-[100px] resize-none"
							{...form.register("motivation")}
						/>
						<FieldError
							errors={errors.motivation ? [errors.motivation] : undefined}
						/>
					</Field>

					<Field>
						<Button
							type="submit"
							disabled={instantSubmitting || form.formState.isSubmitting}
							size="lg"
							className="w-full"
						>
							{form.formState.isSubmitting || instantSubmitting
								? "Enviando..."
								: "Enviar intenção de participação"}
						</Button>
						{successMessage && (
							<p role="status" className="mt-2 text-sm text-foreground">
								{successMessage}
							</p>
						)}
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	);
}
