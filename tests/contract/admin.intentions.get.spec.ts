/**
 * Contract Test: GET /api/admin/intentions
 * Valida o contrato da API conforme especificação
 */

import { GET } from "@/app/api/admin/intentions/route";
import { createMockRequest, getJsonResponse } from "../helpers/test-helpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev-admin-token-change-in-production";

describe("GET /api/admin/intentions", () => {
	beforeEach(async () => {
		await prisma.intention.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("deve retornar 401 quando token admin não é fornecido", async () => {
		const request = createMockRequest("GET", "/api/admin/intentions");

		const response = await GET(request);
		const body = await getJsonResponse(response);

		expect(response.status).toBe(401);
		expect(body).toMatchObject({
			error: "Unauthorized",
		});
	});

	it("deve retornar lista de intenções quando autenticado", async () => {
		// Criar intenções de teste
		await prisma.intention.createMany([
			{
				name: "João",
				email: "joao@example.com",
				company: "TechCorp",
				status: "PENDING",
			},
			{
				name: "Maria",
				email: "maria@example.com",
				company: "InnovaBiz",
				status: "APPROVED",
			},
		]);

		const request = createMockRequest("GET", "/api/admin/intentions", undefined, {
			authorization: `Bearer ${ADMIN_TOKEN}`,
		});

		const response = await GET(request);
		const body = await getJsonResponse(response);

		expect(response.status).toBe(200);
		expect(Array.isArray(body)).toBe(true);
		expect((body as unknown[]).length).toBe(2);
	});
});

