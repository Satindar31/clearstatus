import { get } from "@vercel/edge-config";

export default async function Get(key: string): Promise<string | undefined> {
	if (typeof process !== "undefined" && process.env) {
		return process.env[key];
	}

	let edgeConfigClient;
	if (process.env.EDGE_CONFIG) {
		edgeConfigClient = { get: () => null }; // mock client for build time
	} else {
		edgeConfigClient = { get };
	}

	const result = await edgeConfigClient.get(key);
	if (result === null || result === undefined) {
		return undefined;
	}

	if (typeof result === "string") {
		return result;
	}

	// For objects/arrays/booleans/numbers, convert to a string representation
	if (typeof result === "object") {
		try {
			return JSON.stringify(result);
		} catch {
			return String(result);
		}
	}

	return String(result);
}
