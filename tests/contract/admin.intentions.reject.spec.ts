/**
 * Contract Test: POST /api/admin/intentions/[id]/reject
 */

import { POST } from "@/app/api/admin/intentions/[id]/reject/route";
import { createMockRequest } from "../helpers/test-helpers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev-admin-token-change-in-production";

describe("POST /api/admin/intentions/[id]/reject", () => {
	beforeEach(async () => {
		await prisma.intention.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("deve rejeitar intenção com motivo", async () => {
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
			`/api/admin/intentions/${intention.id}/reject`,
			{ reason: "Perfil não aderente" },
			{ authorization: `Bearer ${ADMIN_TOKEN}` },
		);

		const response = await POST(request, {
			params: Promise.resolve({ id: intention.id }),
		});

		expect(response.status).toBe(204);

		// Verificar que a intenção foi rejeitada
		const updated = await prisma.intention.findUnique({
			where: { id: intention.id },
		});
		expect(updated?.status).toBe("REJECTED");
		expect(updated?.reason).toBe("Perfil não aderente");
	});
});

