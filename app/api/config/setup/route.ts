import { NextRequest } from "next/server";
import { get } from "@vercel/edge-config";

type setupDataT = {
  items: {
    key: string;
    value: string;
    operation: "create" | "update" | "delete" | "upsert";
  }[];
};

export async function POST(req: NextRequest) {
  const {
    setupEmail,
    allowedCheckers,
    allowRegistrations
  }: { setupEmail: boolean; allowedCheckers: string[]; allowRegistrations: boolean } = await req.json();
  const setupData: setupDataT = { items: [] };
  console.log("Setup request received", { setupEmail, allowedCheckers });
  if (!allowedCheckers || allowedCheckers.length === 0) {
    return new Response("Invalid request", { status: 400 });
  }

  const existing = await get("setup-complete");
  if (existing === "true") {
    return new Response("Setup already completed", { status: 400 });
  }

  setupData.items.push({
    key: "setup-complete",
    value: "true",
    operation: "create",
  });
  setupData.items.push({
    key: "use-email",
    value: setupEmail.valueOf().toString(),
    operation: "create",
  });
  setupData.items.push({
    key: "allowed-checkers",
    value: allowedCheckers.join("###"),
    operation: "create",
  });
  setupData.items.push({
    key: "allow-registrations",
    value: allowRegistrations.valueOf().toString(),
    operation: "create",
  });
  console.log("Setup data to be sent to edge config", setupData);

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
  console.log(items);
  return new Response(JSON.stringify(items), { status: 200 });
}
