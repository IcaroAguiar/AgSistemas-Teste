import Link from "next/link";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Page() {
	return (
		<main className="flex flex-1 flex-col gap-16 px-6 py-16 sm:px-10 lg:px-16">
			{/* Header com toggle de tema */}
			<div className="flex justify-end">
				<ThemeToggle />
			</div>

			{/* Hero Section */}
			<section className="mx-auto w-full max-w-5xl text-center">
				<div className="flex justify-center mb-6">
					<Logo width={160} height={160} />
				</div>
				<h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
					AgSistemas
				</h1>
				<p className="mt-4 text-2xl font-medium text-primary">
					Plataforma de Gestão para Grupos de Networking
				</p>
				<p className="mt-6 text-lg text-muted-foreground">
					Gerencie membros, indicações, comunicação e financeiro em um único
					painel integrado.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<Button size="lg" asChild>
						<Link href="/interesse">Expressar Interesse</Link>
					</Button>
					<Button size="lg" variant="outline" asChild>
						<Link href="/status-intencao">Ver Status da Minha Intenção</Link>
					</Button>
				</div>
			</section>

			{/* Features Grid */}
			<section className="grid gap-6 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Gestão de Membros</CardTitle>
						<CardDescription>
							Processo completo de admissão e gestão
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Intenções públicas com validação</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Painel admin para aprovar/recusar</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Cadastro completo com token seguro</span>
							</li>
						</ul>
						<div className="mt-4">
							<Button variant="outline" size="sm" asChild>
								<Link href="/interesse">Ver mais</Link>
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Comunicação & Engajamento</CardTitle>
						<CardDescription>
							Mantenha todos conectados e informados
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Comunicados segmentados</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Reuniões e check-in em tempo real</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Registro de reuniões 1:1</span>
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Negócios & Financeiro</CardTitle>
						<CardDescription>
							Acompanhe indicações e mensalidades
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Indicações com status e obrigado</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Dashboards e relatórios periódicos</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
								<span>Mensalidades com cobrança</span>
							</li>
						</ul>
						<div className="mt-4">
							<Button variant="outline" size="sm" asChild>
								<Link href="/dashboard">Ver Dashboard</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</section>

			{/* Quick Access */}
			<section className="mx-auto w-full max-w-4xl">
				<div className="rounded-2xl border border-white/10 bg-card/70 p-8 backdrop-blur">
					<h2 className="text-2xl font-semibold text-white">
						Acesso Rápido
					</h2>
					<p className="mt-2 text-muted-foreground">
						Principais funcionalidades da plataforma
					</p>
					<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<Button variant="outline" className="h-full flex-col items-start justify-start p-4 text-left" asChild>
							<Link href="/interesse" className="w-full h-full flex flex-col items-start">
								<span className="font-semibold block mb-1">Expressar Interesse</span>
								<span className="text-xs text-muted-foreground block">
									Preencha o formulário para participar
								</span>
							</Link>
						</Button>
						<Button variant="outline" className="h-full flex-col items-start justify-start p-4 text-left" asChild>
							<Link href="/status-intencao" className="w-full h-full flex flex-col items-start">
								<span className="font-semibold block mb-1">Status da Intenção</span>
								<span className="text-xs text-muted-foreground block">
									Consulte se foi aprovado e acesse o link
								</span>
							</Link>
						</Button>
						<Button variant="outline" className="h-full flex-col items-start justify-start p-4 text-left" asChild>
							<Link href="/administracao" className="w-full h-full flex flex-col items-start">
								<span className="font-semibold block mb-1">Área Administrativa</span>
								<span className="text-xs text-muted-foreground block">
									Gerencie intenções e aprovações
								</span>
							</Link>
						</Button>
						<Button variant="outline" className="h-full flex-col items-start justify-start p-4 text-left" asChild>
							<Link href="/dashboard" className="w-full h-full flex flex-col items-start">
								<span className="font-semibold block mb-1">Dashboard</span>
								<span className="text-xs text-muted-foreground block">
									Área privada - Requer autenticação
								</span>
							</Link>
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
