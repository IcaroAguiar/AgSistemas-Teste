import Link from "next/link";

import { Button } from "@/components/ui/button";

const featureColumns = [
	{
		title: "Gestão de Membros",
		bullets: [
			"Intenções públicas com validação",
			"Painel admin para aprovar/recusar",
			"Cadastro completo com token seguro",
		],
	},
	{
		title: "Comunicação & Engajamento",
		bullets: [
			"Comunicados segmentados",
			"Reuniões e check-in em tempo real",
			"Registro de reuniões 1:1",
		],
	},
	{
		title: "Negócios & Financeiro",
		bullets: [
			"Indicações com status e obrigado",
			"Dashboards e relatórios periódicos",
			"Mensalidades com cobrança e reminder",
		],
	},
];

export default function Page() {
	return (
		<main className="flex flex-1 flex-col gap-16 px-6 py-16 sm:px-10 lg:px-16">
			<section className="mx-auto w-full max-w-5xl text-center">
				<p className="text-sm uppercase tracking-[0.3em] text-primary/80">
					Plataforma fullstack Next.js 16 + React 19.2
				</p>
				<h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
					Operação completa para grupos de networking em um único painel
				</h1>
				<p className="mt-6 text-lg text-muted-foreground">
					Arquitetura opinada, testes obrigatórios para fluxos críticos e
					documentação viva (specs, plano, dados e API) já versionadas no
					repositório.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<Button size="lg" asChild>
						<Link href="#docs">Explorar documentação</Link>
					</Button>
					<Button size="lg" variant="secondary" asChild>
						<Link href="#api">Ver contratos de API</Link>
					</Button>
				</div>
			</section>

			<section className="grid gap-6 md:grid-cols-3">
				{featureColumns.map((feature) => (
					<article
						key={feature.title}
						className="rounded-2xl border border-white/10 bg-card/70 p-6 backdrop-blur"
					>
						<h3 className="text-lg font-semibold text-white">
							{feature.title}
						</h3>
						<ul className="mt-4 space-y-2 text-sm text-muted-foreground">
							{feature.bullets.map((item) => (
								<li key={item} className="flex items-start gap-2">
									<span className="mt-1 h-2 w-2 rounded-full bg-accent" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</article>
				))}
			</section>

			<section
				id="docs"
				className="mx-auto w-full max-w-4xl space-y-4 rounded-2xl border border-white/10 bg-card/70 p-8 backdrop-blur"
			>
				<div>
					<p className="text-sm uppercase tracking-[0.3em] text-primary/80">
						Documentação
					</p>
					<h2 className="mt-2 text-2xl font-semibold text-white">
						Arquitetura, dados e especificações
					</h2>
					<p className="text-muted-foreground">
						Todos os artefatos vivem no repositório, dentro da pasta{" "}
						<code className="font-mono">docs/</code> e
						<code className="font-mono">specs/001-admissao-membros/</code>. Abra
						esses arquivos diretamente no editor.
					</p>
				</div>
				<ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
					<li className="rounded-xl border border-white/10 bg-black/20 p-4">
						<p className="font-semibold text-white">docs/architecture.md</p>
						<p>Visão completa do sistema (todas as áreas do desafio).</p>
					</li>
					<li className="rounded-xl border border-white/10 bg-black/20 p-4">
						<p className="font-semibold text-white">docs/data-model.md</p>
						<p>Entidades, campos e relacionamentos.</p>
					</li>
					<li className="rounded-xl border border-white/10 bg-black/20 p-4">
						<p className="font-semibold text-white">docs/api.md</p>
						<p>Rotas REST organizadas por domínio.</p>
					</li>
					<li className="rounded-xl border border-white/10 bg-black/20 p-4">
						<p className="font-semibold text-white">docs/openapi.yaml</p>
						<p>Contrato OpenAPI 3.0 (importável no Insomnia/Postman).</p>
					</li>
				</ul>
			</section>

			<section
				id="api"
				className="mx-auto w-full max-w-4xl space-y-4 rounded-2xl border border-accent/40 bg-card/60 p-8 backdrop-blur"
			>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm uppercase tracking-[0.3em] text-primary/80">
							Contratos
						</p>
						<h2 className="text-2xl font-semibold text-white">
							Estados críticos + testes obrigatórios
						</h2>
						<p className="text-muted-foreground">
							Fluxo P1 (Admissão de Membros) possui testes de contrato e
							integração planejados. Execute{" "}
							<code className="font-mono">pnpm test</code> e{" "}
							<code className="font-mono">pnpm typecheck</code> antes de enviar
							qualquer PR.
						</p>
					</div>
					<Button variant="secondary" asChild>
						<Link href="/docs/api">Abrir docs/api.md</Link>
					</Button>
				</div>
			</section>
		</main>
	);
}
