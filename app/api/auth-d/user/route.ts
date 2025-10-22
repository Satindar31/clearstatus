import prisma from "@/prisma/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response("Missing userId parameter", { status: 400 });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
}