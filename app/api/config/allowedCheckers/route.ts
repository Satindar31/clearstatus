import { get } from "@vercel/edge-config";

export async function GET() {
    const checkers = await get("allowed-checkers")
    return new Response(JSON.stringify({ checkers: checkers?.toString().split("###") }), { status: 200 });
}