"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface LogoProps {
	width?: number;
	height?: number;
	className?: string;
	showText?: boolean;
}

export function Logo({
	width = 40,
	height = 40,
	className = "",
	showText = false,
}: LogoProps) {
	const [imageError, setImageError] = useState(false);

	// Fallback quando a imagem não carregar
	const fallbackLogo = (
		<div
			className={`flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg border border-primary/20 ${className}`}
			style={{ width, height, minWidth: width, minHeight: height }}
		>
			<span
				className="text-primary font-bold"
				style={{ fontSize: `${width * 0.4}px` }}
			>
				AG
			</span>
		</div>
	);

	return (
		<Link
			href="/"
			className="flex items-center gap-3 hover:opacity-80 transition-opacity"
		>
			{imageError ? (
				fallbackLogo
			) : (
				<Image
					src="/images/logo.png"
					alt="AgSistemas Logo"
					width={width}
					height={height}
					className={`object-contain ${className}`}
					priority={showText}
					onError={() => setImageError(true)}
					onLoadingComplete={(result) => {
						// Se a imagem não carregar, o onError será chamado
						if (result.naturalWidth === 0) {
							setImageError(true);
						}
					}}
				/>
			)}
			{showText && (
				<span className="text-xl font-semibold text-foreground">
					AgSistemas
				</span>
			)}
		</Link>
	);
}
