import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const { authorId, title, slug, published } = await request.json();

  try {
    const newStatusPage = await prisma.statusPage.create({
      data: {
        title,
        slug,
        id: crypto.randomUUID(),
        authorId,
      },
    });

    return NextResponse.json(newStatusPage, { status: 201 });
  } catch (error) {
    return new Response("Failed to create status page", { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session || !session.user) {
    return new Response("Unauthorized", {
      status: 401
    })
  }
  try {
    const statusPages = await prisma.statusPage.findMany({
      where: {
        authorId: session?.user.id,
      },
    });
    return NextResponse.json(statusPages, { status: 200 });
  } catch (error) {
    console.error("Error fetching status pages:", error);
    return new Response("Failed to fetch status pages", { status: 500 });
  }
}
