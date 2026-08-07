import { getStore } from "@netlify/blobs";

const COUNT_KEY = "signatures";

export default async (req) => {
  const store = getStore({ name: "petition-count", consistency: "strong" });

  if (req.method === "GET") {
    const stored = await store.get(COUNT_KEY, { type: "json" });
    const count = Number(stored) || 0;

    return Response.json(
      { count },
      { headers: { "Cache-Control": "public, max-age=30" } }
    );
  }

  if (req.method === "POST") {
    const stored = await store.get(COUNT_KEY, { type: "json" });
    const next = (Number(stored) || 0) + 1;
    await store.setJSON(COUNT_KEY, next);

    return Response.json({ count: next });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/petition-count",
};
