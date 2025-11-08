import { IntentionForm } from "@/components/forms/IntentionForm";

export default function InteressePage() {
	return (
		<main className="flex flex-1 flex-col gap-8 px-6 py-16 sm:px-10 lg:px-16">
			<section className="mx-auto w-full max-w-2xl">
				<div className="space-y-4 text-center">
					<h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
						Expressar Interesse
					</h1>
					<p className="text-lg text-muted-foreground">
						Preencha o formulário abaixo para expressar seu interesse em fazer
						parte do nosso grupo de networking. Nossa equipe entrará em contato
						em breve.
					</p>
				</div>

				<div className="mt-8 rounded-2xl border border-white/10 bg-card/70 p-8 backdrop-blur">
					<IntentionForm />
				</div>
			</section>
		</main>
	);
}

