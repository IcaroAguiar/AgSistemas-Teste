"use client";

import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Componente de login administrativo discreto
 * Permite que administradores façam login na landing page
 * Só aparece quando não há token válido
 */
export function AdminLogin() {
	const [token, setToken] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [hasToken, setHasToken] = useState(false);

	useEffect(() => {
		// Verificar se há token no cookie
		const checkAuth = () => {
			const cookieToken = document.cookie
				.split("; ")
				.find((row) => row.startsWith("adminToken="))
				?.split("=")[1];
			setHasToken(!!cookieToken);
		};

		checkAuth();
		// Verificar periodicamente
		const interval = setInterval(checkAuth, 2000);
		return () => clearInterval(interval);
	}, []);

	const handleLogin = async () => {
		if (!token.trim()) {
			toast.error("Erro", {
				description: "Token de administração é obrigatório",
			});
			return;
		}

		setIsLoading(true);

		try {
			// Validar token fazendo uma requisição à API admin
			const response = await fetch("/api/admin/intentions", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				if (response.status === 401) {
					toast.error("Token Inválido", {
						description: "O token fornecido não é válido",
					});
					return;
				}
				throw new Error("Erro ao validar token");
			}

			// Token válido - salvar em cookie e localStorage
			localStorage.setItem("adminToken", token);
			document.cookie = `adminToken=${token}; path=/; max-age=86400; SameSite=Lax`;

			toast.success("Login realizado!", {
				description: "Acesso administrativo ativado",
			});

			setIsOpen(false);
			setToken("");
			// Recarregar página para atualizar o menu AdminNavigation
			window.location.reload();
		} catch (err) {
			toast.error("Erro", {
				description: err instanceof Error ? err.message : "Erro ao fazer login",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Não mostrar se já estiver autenticado
	if (hasToken) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground"
				>
					<LogIn className="h-4 w-4 mr-1.5" />
					Admin
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Acesso Administrativo</DialogTitle>
					<DialogDescription>
						Insira o token de administração para acessar as áreas privadas
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="adminToken">Token de Administração</Label>
						<Input
							id="adminToken"
							type="password"
							placeholder="Insira o token"
							value={token}
							onChange={(e) => setToken(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleLogin();
								}
							}}
							disabled={isLoading}
						/>
					</div>
					<Button
						onClick={handleLogin}
						disabled={isLoading || !token.trim()}
						className="w-full"
					>
						{isLoading ? "Validando..." : "Entrar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
