import { get } from "@vercel/edge-config";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const {
    mailHost,
    mailPort,
    mailUser,
    mailPass,
    mailFrom,
  }: {
    mailHost: string;
    mailPort: number;
    mailUser: string;
    mailPass: string;
    mailFrom: string;
  } = await req.json();
  if (!mailHost || !mailPort || !mailUser || !mailPass || !mailFrom) {
    return new Response("Invalid request", { status: 400 });
  }
  const mailEnabled = await get("use-email");
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
    key: "mail-host",
    value: mailHost,
    operation: "upsert",
  });
  setupData.items.push({
    key: "mail-port",
    value: mailPort.toString(),
    operation: "upsert",
  });
  setupData.items.push({
    key: "mail-user",
    value: mailUser,
    operation: "upsert",
  });
  setupData.items.push({
    key: "mail-pass",
    value: mailPass,
    operation: "upsert",
  });
  setupData.items.push({
    key: "mail-from",
    value: mailFrom,
    operation: "upsert",
  });
  console.log("Mail config request received", {
    mailHost,
    mailPort,
    mailUser,
    mailPass: "********",
    mailFrom,
  });

  const resp = await fetch(
    `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setupData),
    }
  );
  if (!resp.ok) {
    console.error("Failed to fetch edge config items", await resp.text());
    return new Response("Failed to fetch edge config items", { status: 500 });
  }
  const items = await resp.json();
  console.log("Edge config items response", items);
  return new Response("Mail config set successfully", { status: 200 });
}
