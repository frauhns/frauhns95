export async function onRequest(context) {
  try {
    const raw = await context.env.SITE_KV.get("posts");
    const data = raw ? JSON.parse(raw) : [];
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
