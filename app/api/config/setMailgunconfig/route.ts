import Get from "@/lib/edgeClient";
import { get } from "@vercel/edge-config";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const {
    mailDomain,
    mailApiKey,
    region,
  }: {
    mailDomain: string;
    mailApiKey: string;
    region: string;
  } = await req.json();
  if (!mailDomain || !mailApiKey || !region) {
    return new Response("Invalid request", { status: 400 });
  }
  const mailEnabled = await Get("use-email");
  if (mailEnabled !== "true") {
    return new Response("Email not enabled", { status: 400 });
  }
  const setupData = {
    items: [] as {
      key: string;
      value: string;
      operation: "create" | "update" | "delete" | "upsert";
    }[],
  };
  setupData.items.push({
    key: "mailgun-domain",
    value: mailDomain,
    operation: "upsert",
  });
  setupData.items.push({
    key: "mailgun-api-key",
    value: mailApiKey,
    operation: "upsert",
  });
  setupData.items.push({
    key: "mailgun-reigon",
    value: region,
    operation: "upsert",
  });
  const resp = await fetch(
    `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      body: JSON.stringify(setupData),
    }
  );
  if (!resp.ok) {
    console.log(resp.status)
    console.error("Failed to set Mailgun config", await resp.text());
    return new Response("Failed to set Mailgun config", { status: 500 });
  }
  return new Response("Mailgun config set successfully", { status: 200 });
}
