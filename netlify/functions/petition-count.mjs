export default async () => {
  const token =
    Netlify.env.get("NETLIFY_API_TOKEN") || Netlify.env.get("NETLIFY_AUTH_TOKEN");
  const siteId = Netlify.env.get("SITE_ID");

  if (!token || !siteId) {
    return Response.json({ count: null }, {
      headers: { "Cache-Control": "public, max-age=60" },
    });
  }

  try {
    const formsRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/forms`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!formsRes.ok) {
      return Response.json({ count: null }, { status: formsRes.status });
    }

    const forms = await formsRes.json();
    const form = forms.find((entry) => entry.name === "petition");

    if (!form) {
      return Response.json({ count: 0 });
    }

    if (typeof form.submission_count === "number") {
      return Response.json(
        { count: form.submission_count },
        { headers: { "Cache-Control": "public, max-age=120" } }
      );
    }

    let count = 0;
    let page = 1;

    while (page <= 20) {
      const subsRes = await fetch(
        `https://api.netlify.com/api/v1/forms/${form.id}/submissions?page=${page}&per_page=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!subsRes.ok) break;

      const subs = await subsRes.json();
      if (!Array.isArray(subs) || subs.length === 0) break;

      count += subs.length;
      if (subs.length < 100) break;
      page += 1;
    }

    return Response.json(
      { count },
      { headers: { "Cache-Control": "public, max-age=120" } }
    );
  } catch {
    return Response.json({ count: null }, { status: 500 });
  }
};

export const config = {
  path: "/api/petition-count",
};
