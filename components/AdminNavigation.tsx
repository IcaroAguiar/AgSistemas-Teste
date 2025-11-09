"use client";

import { LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Componente de navegação administrativa discreto
 * Só é exibido quando o usuário está autenticado (tem token válido no cookie)
 * Aparece de forma sutil no header da landing page
 * Abre apenas com clique (não hover)
 */
export function AdminNavigation() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Verificar se há token no cookie
		const checkAuth = () => {
			const cookieToken = document.cookie
				.split("; ")
				.find((row) => row.startsWith("adminToken="))
				?.split("=")[1];
			setIsAuthenticated(!!cookieToken);
		};

		checkAuth();
		// Verificar periodicamente (a cada 2 segundos) para atualizar o estado
		const interval = setInterval(checkAuth, 2000);
		return () => clearInterval(interval);
	}, []);

	if (!isAuthenticated) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground"
				>
					Admin
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>Área Administrativa</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link
						href="/administracao"
						className="flex items-center gap-3 cursor-pointer"
					>
						<Settings className="h-4 w-4 text-muted-foreground" />
						<div className="flex flex-col items-start">
							<span className="font-medium text-sm">Administração</span>
							<span className="text-xs text-muted-foreground">
								Intenções e aprovações
							</span>
						</div>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href="/dashboard"
						className="flex items-center gap-3 cursor-pointer"
					>
						<LayoutDashboard className="h-4 w-4 text-muted-foreground" />
						<div className="flex flex-col items-start">
							<span className="font-medium text-sm">Dashboard</span>
							<span className="text-xs text-muted-foreground">
								Métricas e KPIs
							</span>
						</div>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
