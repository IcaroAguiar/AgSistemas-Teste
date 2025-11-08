"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
	width?: number;
	height?: number;
	className?: string;
	showText?: boolean;
}

export function Logo({ width = 40, height = 40, className = "", showText = false }: LogoProps) {
	return (
		<Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
			<Image
				src="/images/logo.png"
				alt="AgSistemas Logo"
				width={width}
				height={height}
				className={`object-contain ${className}`}
				priority={showText}
			/>
			{showText && (
				<span className="text-xl font-semibold text-white">AgSistemas</span>
			)}
		</Link>
	);
}

