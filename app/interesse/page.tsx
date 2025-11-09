import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { IntentionForm } from "@/components/forms/IntentionForm";
import { Button } from "@/components/ui/button";

export default function InteressePage() {
	return (
		<main className="flex flex-1 flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
			<section className="mx-auto w-full max-w-2xl">
				<div className="mb-4">
					<Button variant="ghost" asChild>
						<Link href="/">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Voltar ao Início
						</Link>
					</Button>
				</div>
				<div className="space-y-4 text-center">
					<h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
						Expressar Interesse
					</h1>
					<p className="text-lg text-muted-foreground">
						Preencha o formulário abaixo para expressar seu interesse em fazer
						parte do nosso grupo de networking. Nossa equipe entrará em contato
						em breve.
					</p>
				</div>

				<div className="mt-8 rounded-2xl border border-border bg-card/70 p-8 backdrop-blur">
					<IntentionForm />
				</div>
			</section>
		</main>
	);
}
