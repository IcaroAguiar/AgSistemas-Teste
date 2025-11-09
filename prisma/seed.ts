import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Iniciando seed do banco de dados...");

	// Limpar dados existentes (apenas em desenvolvimento)
	if (process.env.NODE_ENV === "development") {
		console.log("🧹 Limpando dados existentes...");
		await prisma.invitation.deleteMany();
		await prisma.intention.deleteMany();
		await prisma.member.deleteMany();
		await prisma.announcement.deleteMany();
		await prisma.attendance.deleteMany();
		await prisma.meeting.deleteMany();
		await prisma.gratitude.deleteMany();
		await prisma.referral.deleteMany();
		await prisma.oneOnOne.deleteMany();
		await prisma.invoice.deleteMany();
	}

	// Criar membro admin de exemplo
	const adminMember = await prisma.member.upsert({
		where: { email: "admin@example.com" },
		update: {},
		create: {
			name: "Administrador",
			email: "admin@example.com",
			company: "AgSistemas",
			role: "ADMIN",
			status: "ACTIVE",
			joinedAt: new Date(),
		},
	});

	console.log("✅ Admin criado:", adminMember.email);

	// Criar alguns membros de exemplo
	const members = await Promise.all([
		prisma.member.upsert({
			where: { email: "joao@example.com" },
			update: {},
			create: {
				name: "João Silva",
				email: "joao@example.com",
				company: "TechCorp",
				role: "MEMBER",
				status: "ACTIVE",
				joinedAt: new Date(),
			},
		}),
		prisma.member.upsert({
			where: { email: "maria@example.com" },
			update: {},
			create: {
				name: "Maria Santos",
				email: "maria@example.com",
				company: "InnovaBiz",
				role: "MEMBER",
				status: "ACTIVE",
				joinedAt: new Date(),
			},
		}),
	]);

	console.log(`✅ ${members.length} membros criados`);

	// Criar algumas intenções de exemplo
	const intentions = await Promise.all([
		prisma.intention.create({
			data: {
				name: "Pedro Costa",
				email: "pedro@example.com",
				company: "StartupXYZ",
				status: "PENDING",
			},
		}),
		prisma.intention.create({
			data: {
				name: "Ana Oliveira",
				email: "ana@example.com",
				company: "Digital Solutions",
				status: "PENDING",
			},
		}),
	]);

	console.log(`✅ ${intentions.length} intenções criadas`);

	// Criar um anúncio de exemplo
	const announcement = await prisma.announcement.create({
		data: {
			title: "Bem-vindos à plataforma!",
			message: "Esta é uma mensagem de boas-vindas para todos os membros.",
			authorId: adminMember.id,
			publishedAt: new Date(),
		},
	});

	console.log("✅ Anúncio criado:", announcement.title);

	console.log("🎉 Seed concluído com sucesso!");
}

main()
	.catch((e) => {
		console.error("❌ Erro ao executar seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
