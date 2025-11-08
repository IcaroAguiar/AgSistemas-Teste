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

export function Logo({ width = 40, height = 40, className = "", showText = false }: LogoProps) {
	const [imageError, setImageError] = useState(false);

	// Se a imagem não carregar, mostrar apenas o texto
	if (imageError) {
		return (
			<Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
				<div
					className={`flex items-center justify-center bg-primary/20 rounded-lg ${className}`}
					style={{ width, height }}
				>
					<span className="text-primary font-bold text-sm">AG</span>
				</div>
				{showText && (
					<span className="text-xl font-semibold text-white">AgSistemas</span>
				)}
			</Link>
		);
	}

	return (
		<Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
			<Image
				src="/images/logo.png"
				alt="AgSistemas Logo"
				width={width}
				height={height}
				className={`object-contain ${className}`}
				priority={showText}
				onError={() => setImageError(true)}
				unoptimized
			/>
			{showText && (
				<span className="text-xl font-semibold text-white">AgSistemas</span>
			)}
		</Link>
	);
}

