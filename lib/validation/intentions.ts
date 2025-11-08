import { z } from "zod";

/**
 * Schema de validação para criação de intenção
 */
export const createIntentionSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório").max(120, "Nome muito longo"),
	email: z.string().email("Email inválido"),
	company: z.string().min(1, "Empresa é obrigatória").max(160, "Nome da empresa muito longo"),
});

export type CreateIntentionInput = z.infer<typeof createIntentionSchema>;

/**
 * Schema de validação para resposta de intenção
 */
export const intentionResponseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	company: z.string(),
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export type IntentionResponse = z.infer<typeof intentionResponseSchema>;

