"use client";

import { LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

/**
 * Componente de navegação administrativa discreto
 * Só é exibido quando o usuário está autenticado (tem token válido no cookie)
 * Aparece de forma sutil no header da landing page
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
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground">
						Admin
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[280px] gap-1 p-2">
							<li>
								<NavigationMenuLink asChild>
									<Link
										href="/administracao"
										className="flex items-center gap-3 rounded-md p-2.5 hover:bg-accent transition-colors text-sm"
									>
										<Settings className="h-4 w-4 text-muted-foreground" />
										<div className="flex flex-col items-start">
											<span className="font-medium text-sm">Administração</span>
											<span className="text-xs text-muted-foreground">
												Intenções e aprovações
											</span>
										</div>
									</Link>
								</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink asChild>
									<Link
										href="/dashboard"
										className="flex items-center gap-3 rounded-md p-2.5 hover:bg-accent transition-colors text-sm"
									>
										<LayoutDashboard className="h-4 w-4 text-muted-foreground" />
										<div className="flex flex-col items-start">
											<span className="font-medium text-sm">Dashboard</span>
											<span className="text-xs text-muted-foreground">
												Métricas e KPIs
											</span>
										</div>
									</Link>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
