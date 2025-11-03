import Get from "@/lib/edgeClient";

export async function GET() {
    const checkers = await Get("allowed-checkers")
    return new Response(JSON.stringify({ checkers: checkers?.toString().split("###") }), { status: 200 });
}