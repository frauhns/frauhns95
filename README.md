# Frauhns95

Personal desktop site, Win95-styled. Draggable windows, taskbar, start menu, music player, blog reader, theme switcher.

**Live:** https://frauhns.pages.dev

## Stack

HTML/CSS/JS, no frameworks. Cloudflare Pages Functions (`functions/`) for playlist, lyrics, posts, offsets APIs. Cloudflare Workers KV backs posts/offsets.

## Local run

Open `index.html`. No build step.

For `/api/*` routes:

```
npm install
npx wrangler dev
```

### KV setup

`posts` + `offsets` live in KV namespace `SITE_KV`, not static json.

```
npx wrangler kv namespace create SITE_KV
```

Add id to `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SITE_KV"
id = "<your-namespace-id>"
```

Seed data (local `posts.json`/`offsets.json`, not in repo):

```
npx wrangler kv key put --binding=SITE_KV "posts" --path=posts.json
npx wrangler kv key put --binding=SITE_KV "offsets" --path=offsets.json
```

Re-run `put` on content changes.

## License

Personal project. Not licensed for reuse.
