export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const artist = searchParams.get("artist");
  const title = searchParams.get("title");
  const duration = searchParams.get("duration");

  if (!artist || !title) {
    return new Response(JSON.stringify({ error: "missing artist or title" }), { status: 400 });
  }

  try {
    if (duration) {
      const baseDuration = parseInt(duration, 10);
      const offsetsToTry = [0, 1, -1, 2, -2];

      for (const offset of offsetsToTry) {
        const tryDuration = baseDuration + offset;
        const getRes = await fetch(
          `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}&duration=${tryDuration}`
        );
        if (getRes.ok) {
          const data = await getRes.json();
          if (data.syncedLyrics) {
            return new Response(JSON.stringify({ syncedLyrics: data.syncedLyrics }), {
              headers: { "Content-Type": "application/json" },
            });
          }
        }
      }
    }

    const searchRes = await fetch(
      `https://lrclib.net/api/search?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`
    );

    if (!searchRes.ok) {
      return new Response(JSON.stringify({ error: "no lyrics found" }), { status: 404 });
    }

    const results = await searchRes.json();

    if (!Array.isArray(results) || results.length === 0) {
      return new Response(JSON.stringify({ error: "no lyrics found" }), { status: 404 });
    }

    const match = results.find(r => r.syncedLyrics) || results[0];

    if (!match.syncedLyrics) {
      return new Response(JSON.stringify({ error: "no synced lyrics found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ syncedLyrics: match.syncedLyrics }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}