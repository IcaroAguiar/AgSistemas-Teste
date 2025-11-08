import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "AgSistemas • Plataforma de Networking",
	description:
		"Gestão de membros, indicações, comunicação e financeiro em um único painel.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body
				className={`${fontSans.variable} bg-background font-sans text-foreground`}
			>
				<ThemeProvider>
					<div className="flex min-h-screen flex-col">{children}</div>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
