/**
 * Logging estruturado para a aplicação
 * Usa console.log com formato JSON para facilitar parsing e análise
 */

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogContext {
	[key: string]: unknown;
}

export interface LogEntry {
	level: LogLevel;
	message: string;
	timestamp: string;
	requestId?: string;
	userId?: string;
	[key: string]: unknown;
}

/**
 * Cria um logger estruturado
 */
export function createLogger(requestId?: string) {
	const log = (
		level: LogLevel,
		message: string,
		context: LogContext = {},
	) => {
		const entry: LogEntry = {
			level,
			message,
			timestamp: new Date().toISOString(),
			...(requestId && { requestId }),
			...context,
		};

		// Em produção, usar formato JSON estruturado
		if (process.env.NODE_ENV === "production") {
			console.log(JSON.stringify(entry));
		} else {
			// Em desenvolvimento, formato mais legível
			const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
			console.log(prefix, message, context);
		}
	};

	return {
		info: (message: string, context?: LogContext) =>
			log("info", message, context),
		warn: (message: string, context?: LogContext) =>
			log("warn", message, context),
		error: (message: string, context?: LogContext) =>
			log("error", message, context),
		debug: (message: string, context?: LogContext) =>
			log("debug", message, context),
	};
}

/**
 * Logger padrão (sem requestId)
 */
export const logger = createLogger();

/**
 * Gera um request ID único para rastreamento
 */
export function generateRequestId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

