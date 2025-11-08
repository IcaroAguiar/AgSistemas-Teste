/**
 * Contract Test: POST /api/admin/intentions/[id]/approve
 */

import { POST } from "@/app/api/admin/intentions/[id]/approve/route";
import { createMockRequest, getJsonResponse } from "../helpers/test-helpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev-admin-token-change-in-production";

describe("POST /api/admin/intentions/[id]/approve", () => {
	beforeEach(async () => {
		await prisma.invitation.deleteMany();
		await prisma.intention.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("deve aprovar intenção e gerar convite", async () => {
		const intention = await prisma.intention.create({
			data: {
				name: "João",
				email: "joao@example.com",
				company: "TechCorp",
				status: "PENDING",
			},
		});

		const request = createMockRequest(
			"POST",
			`/api/admin/intentions/${intention.id}/approve`,
			undefined,
			{ authorization: `Bearer ${ADMIN_TOKEN}` },
		);

		const response = await POST(request, {
			params: Promise.resolve({ id: intention.id }),
		});
		const body = await getJsonResponse(response);

		expect(response.status).toBe(200);
		expect(body).toMatchObject({
			message: "invitation created",
			url: expect.stringContaining("/signup/"),
			expiresAt: expect.any(String),
		});

		// Verificar que a intenção foi aprovada
		const updated = await prisma.intention.findUnique({
			where: { id: intention.id },
			include: { invitation: true },
		});
		expect(updated?.status).toBe("APPROVED");
		expect(updated?.invitation).toBeTruthy();
	});
});

