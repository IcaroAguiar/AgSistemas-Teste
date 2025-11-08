/**
 * Integration Test: Submeter intenção via UI
 * Testa o fluxo completo de submissão de intenção através da interface
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntentionForm } from "@/components/forms/IntentionForm";
import { PrismaClient } from "@prisma/client";

// Mock do fetch
global.fetch = jest.fn();

const prisma = new PrismaClient();

describe("Integration: Submeter intenção via UI", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(global.fetch as jest.Mock).mockClear();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("deve submeter intenção com sucesso através do formulário", async () => {
		const user = userEvent.setup();

		// Mock da resposta da API
		const mockResponse = {
			id: "test-id",
			name: "João Silva",
			email: "joao@example.com",
			company: "TechCorp",
			status: "PENDING",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => mockResponse,
		});

		// Renderizar componente
		render(<IntentionForm />);

		// Preencher formulário
		const nameInput = screen.getByLabelText(/nome completo/i);
		const emailInput = screen.getByLabelText(/email/i);
		const companyInput = screen.getByLabelText(/empresa/i);
		const submitButton = screen.getByRole("button", {
			name: /enviar intenção/i,
		});

		await user.type(nameInput, "João Silva");
		await user.type(emailInput, "joao@example.com");
		await user.type(companyInput, "TechCorp");

		// Submeter formulário
		await user.click(submitButton);

		// Verificar que a API foi chamada
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith("/api/intentions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "João Silva",
					email: "joao@example.com",
					company: "TechCorp",
				}),
			});
		});

		// Verificar mensagem de sucesso
		await waitFor(() => {
			expect(
				screen.getByText(/intenção enviada com sucesso/i),
			).toBeInTheDocument();
		});

		// Verificar que o formulário foi limpo
		expect(nameInput).toHaveValue("");
		expect(emailInput).toHaveValue("");
		expect(companyInput).toHaveValue("");
	});

	it("deve exibir erro quando a API retorna erro", async () => {
		const user = userEvent.setup();

		// Mock de erro da API
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			json: async () => ({
				error: "ValidationError",
				message: "Email inválido",
			}),
		});

		// Renderizar componente
		render(<IntentionForm />);

		// Preencher e submeter
		const nameInput = screen.getByLabelText(/nome completo/i);
		const emailInput = screen.getByLabelText(/email/i);
		const companyInput = screen.getByLabelText(/empresa/i);
		const submitButton = screen.getByRole("button", {
			name: /enviar intenção/i,
		});

		await user.type(nameInput, "João");
		await user.type(emailInput, "email-invalido");
		await user.type(companyInput, "TechCorp");
		await user.click(submitButton);

		// Verificar mensagem de erro
		await waitFor(() => {
			expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
		});
	});

	it("deve desabilitar o botão durante o envio", async () => {
		const user = userEvent.setup();

		// Mock de resposta lenta
		let resolvePromise: (value: unknown) => void;
		const slowPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});

		(global.fetch as jest.Mock).mockReturnValueOnce(slowPromise);

		// Renderizar componente
		render(<IntentionForm />);

		// Preencher formulário
		const nameInput = screen.getByLabelText(/nome completo/i);
		const emailInput = screen.getByLabelText(/email/i);
		const companyInput = screen.getByLabelText(/empresa/i);
		const submitButton = screen.getByRole("button", {
			name: /enviar intenção/i,
		});

		await user.type(nameInput, "João");
		await user.type(emailInput, "joao@example.com");
		await user.type(companyInput, "TechCorp");

		// Submeter
		await user.click(submitButton);

		// Verificar que o botão está desabilitado
		expect(submitButton).toBeDisabled();
		expect(screen.getByText(/enviando/i)).toBeInTheDocument();

		// Resolver a promise
		resolvePromise!({
			ok: true,
			json: async () => ({}),
		});
	});
});

