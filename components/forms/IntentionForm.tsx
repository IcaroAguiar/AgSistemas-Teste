"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function IntentionForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await fetch("/api/intentions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Erro ao enviar intenção");
			}

			setSuccess(true);
			setFormData({ name: "", email: "", company: "" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro desconhecido");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="name">
					Nome completo <span className="text-destructive">*</span>
				</Label>
				<Input
					id="name"
					name="name"
					type="text"
					required
					value={formData.name}
					onChange={(e) =>
						setFormData({ ...formData, name: e.target.value })
					}
					placeholder="Seu nome completo"
					disabled={isSubmitting}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">
					Email <span className="text-destructive">*</span>
				</Label>
				<Input
					id="email"
					name="email"
					type="email"
					required
					value={formData.email}
					onChange={(e) =>
						setFormData({ ...formData, email: e.target.value })
					}
					placeholder="seu@email.com"
					disabled={isSubmitting}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="company">
					Empresa <span className="text-destructive">*</span>
				</Label>
				<Input
					id="company"
					name="company"
					type="text"
					required
					value={formData.company}
					onChange={(e) =>
						setFormData({ ...formData, company: e.target.value })
					}
					placeholder="Nome da sua empresa"
					disabled={isSubmitting}
				/>
			</div>

			{error && (
				<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
					{error}
				</div>
			)}

			{success && (
				<div className="rounded-md bg-green-500/10 p-3 text-sm text-green-500">
					Intenção enviada com sucesso! Aguarde o contato da administração.
				</div>
			)}

			<Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
				{isSubmitting ? "Enviando..." : "Enviar intenção de participação"}
			</Button>
		</form>
	);
}

