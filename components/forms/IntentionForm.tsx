"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { createIntentionSchema, type CreateIntentionInput } from "@/lib/validation/intentions";

export function IntentionForm() {
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
			const response = await fetch("/api/intentions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Erro ao enviar intenção");
			}

			form.reset();
			toast.success("Sucesso!", {
				description: "Intenção enviada com sucesso! Aguarde o contato da administração.",
			});
		} catch (err) {
			toast.error("Erro", {
				description: err instanceof Error ? err.message : "Erro desconhecido",
			});
		}
	};

	const errors = form.formState.errors;

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<FieldSet>
				<FieldGroup>
					<Field data-invalid={!!errors.name}>
						<FieldLabel htmlFor="name">
							Nome completo <span className="text-destructive">*</span>
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
						<FieldError errors={errors.motivation ? [errors.motivation] : undefined} />
					</Field>

					<Field>
						<Button
							type="submit"
							disabled={form.formState.isSubmitting}
							size="lg"
							className="w-full"
						>
							{form.formState.isSubmitting
								? "Enviando..."
								: "Enviar intenção de participação"}
						</Button>
					</Field>
				</FieldGroup>
			</FieldSet>
		</form>
	);
}
