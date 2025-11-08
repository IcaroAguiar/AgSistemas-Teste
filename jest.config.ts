import type { Config } from "jest";

const config: Config = {
	testEnvironment: "jest-environment-jsdom",
	moduleDirectories: ["node_modules", "<rootDir>/"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	transform: {
		"^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
	},
	testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
	// Configurar ambiente por arquivo de teste
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[jt]s?(x)",
	],
	// Usar node para testes de API (contract tests)
	projects: [
		{
			displayName: "dom",
			testEnvironment: "jest-environment-jsdom",
			testMatch: ["**/integration/**/*.spec.[jt]s?(x)", "**/unit/**/*.spec.[jt]s?(x)"],
			moduleDirectories: ["node_modules", "<rootDir>/"],
			moduleNameMapper: {
				"^@/(.*)$": "<rootDir>/$1",
			},
			setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
			transform: {
				"^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
			},
		},
		{
			displayName: "node",
			testEnvironment: "node",
			testMatch: ["**/contract/**/*.spec.[jt]s?(x)"],
			moduleDirectories: ["node_modules", "<rootDir>/"],
			moduleNameMapper: {
				"^@/(.*)$": "<rootDir>/$1",
			},
			transform: {
				"^.+\\.(ts|tsx)$": ["ts-jest", { 
					tsconfig: "tsconfig.json",
					useESM: false,
				}],
			},
		},
	],
};

export default config;
