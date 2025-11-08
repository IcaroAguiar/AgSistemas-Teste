import fs from "node:fs";
import path from "node:path";

const DOC_RELATIVE = "docs/api.md";
const OPENAPI_RELATIVE = "docs/openapi.yaml";
const DOC_PATH = path.join(process.cwd(), DOC_RELATIVE);

export default function ApiDocsPage() {
	const markdown = fs.readFileSync(DOC_PATH, "utf8");

	return (
		<main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16">
			<header className="space-y-3">
				<p className="text-sm uppercase tracking-[0.3em] text-primary/80">
					Documentação técnica
				</p>
				<h1 className="text-3xl font-semibold text-white">docs/api.md</h1>
				<p className="text-muted-foreground">
					Conteúdo renderizado diretamente do arquivo Markdown localizado em{" "}
					<code className="font-mono">{DOC_RELATIVE}</code>. Para interagir com
					a especificação OpenAPI, importe o arquivo{" "}
					<code className="font-mono">{OPENAPI_RELATIVE}</code> no seu cliente
					HTTP favorito.
				</p>
			</header>
			<section className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm leading-relaxed text-muted-foreground">
				<pre className="whitespace-pre-wrap">{markdown}</pre>
			</section>
			<section className="rounded-2xl border border-accent/40 bg-card/60 p-6 text-sm text-muted-foreground">
				<p className="font-semibold text-white">Arquivos úteis</p>
				<ul className="mt-3 list-disc space-y-1 pl-6">
					<li>
						<code className="font-mono">{DOC_RELATIVE}</code> – texto exibido
						acima
					</li>
					<li>
						<code className="font-mono">{OPENAPI_RELATIVE}</code> – contrato
						OpenAPI 3.0
					</li>
				</ul>
			</section>
		</main>
	);
}
