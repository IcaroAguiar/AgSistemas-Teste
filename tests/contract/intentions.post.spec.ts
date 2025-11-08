/**
 * Contract Test: POST /api/intentions
 * Valida o contrato da API conforme especificação
 */

import { POST } from "@/app/api/intentions/route";
import { createMockRequest, getJsonResponse } from "../helpers/test-helpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("POST /api/intentions", () => {
	beforeEach(async () => {
		// Limpar intenções antes de cada teste
		await prisma.intention.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("deve criar uma intenção com dados válidos e retornar 201", async () => {
		// Arrange
		const validData = {
			name: "João Silva",
			email: "joao@example.com",
			company: "TechCorp",
		};

		const request = createMockRequest("POST", "/api/intentions", validData);

		// Act
		const response = await POST(request);
		const body = await getJsonResponse(response);

		// Assert
		expect(response.status).toBe(201);
		expect(body).toMatchObject({
			id: expect.any(String),
			name: validData.name,
			email: validData.email,
			company: validData.company,
			status: "PENDING",
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});

		// Verificar que foi salvo no banco
		const bodyData = body as { id: string };
		const saved = await prisma.intention.findUnique({
			where: { id: bodyData.id },
		});
		expect(saved).toBeTruthy();
		expect(saved?.status).toBe("PENDING");
	});

	it("deve retornar 400 quando dados são inválidos (email inválido)", async () => {
		// Arrange
		const invalidData = {
			name: "João Silva",
			email: "email-invalido",
			company: "TechCorp",
		};

		const request = createMockRequest("POST", "/api/intentions", invalidData);

		// Act
		const response = await POST(request);
		const body = await getJsonResponse(response);

		// Assert
		expect(response.status).toBe(400);
		expect(body).toMatchObject({
			error: expect.any(String),
			message: expect.any(String),
		});
	});

	it("deve retornar 400 quando dados são inválidos (nome vazio)", async () => {
		// Arrange
		const invalidData = {
			name: "",
			email: "joao@example.com",
			company: "TechCorp",
		};

		const request = createMockRequest("POST", "/api/intentions", invalidData);

		// Act
		const response = await POST(request);
		const body = await getJsonResponse(response);

		// Assert
		expect(response.status).toBe(400);
		expect(body).toMatchObject({
			error: expect.any(String),
		});
	});

	it("deve retornar 409 quando já existe intenção pendente com mesmo email", async () => {
		// Arrange - criar intenção existente
		await prisma.intention.create({
			data: {
				name: "João Existente",
				email: "joao@example.com",
				company: "TechCorp",
				status: "PENDING",
			},
		});

		const duplicateData = {
			name: "João Novo",
			email: "joao@example.com",
			company: "OutraEmpresa",
		};

		const request = createMockRequest("POST", "/api/intentions", duplicateData);

		// Act
		const response = await POST(request);
		const body = await getJsonResponse(response);

		// Assert
		expect(response.status).toBe(409);
		expect(body).toMatchObject({
			error: "Conflict",
			message: expect.any(String),
		});
		expect((body as { message: string }).message.toLowerCase()).toContain("já existe");
	});
});

