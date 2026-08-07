import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const contentType = req.headers.get("content-type") || "";

  if (!contentType.includes("application/x-www-form-urlencoded")) {
    return Response.json({ ok: false, error: "Invalid content type" }, { status: 400 });
  }

  const params = new URLSearchParams(await req.text());
  const botField = params.get("bot-field");

  if (botField) {
    return Response.json({ ok: true, count: null });
  }

  const name = (params.get("name") || "").trim();
  const address = (params.get("address") || "").trim();
  const telephone = (params.get("telephone") || "").trim();
  const comments = (params.get("comments") || "").trim();

  if (!name || !address) {
    return Response.json({ ok: false, error: "Name and address are required" }, { status: 400 });
  }

  const submission = {
    name,
    address,
    telephone,
    comments,
    submittedAt: new Date().toISOString(),
  };

  const submissionsStore = getStore({
    name: "petition-submissions",
    consistency: "strong",
  });
  const countStore = getStore({ name: "petition-count", consistency: "strong" });

  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await submissionsStore.setJSON(`submission-${id}`, submission);

  const current = Number(await countStore.get("signatures", { type: "json" })) || 0;
  const next = current + 1;
  await countStore.setJSON("signatures", next);

  return Response.json({ ok: true, count: next });
};

export const config = {
  path: "/api/submit-petition",
};
