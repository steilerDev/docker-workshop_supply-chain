// server.js
import express from "express";
import { createClient } from "redis";


const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const REDIS_KEY = process.env.REDIS_KEY || "demo:value";


// Redis client (node-redis v4)
const redis = createClient({ url: REDIS_URL });
redis.on("error", (err) => console.error("Redis error:", err));


await redis.connect();


app.use(express.urlencoded({ extended: false }));


// Tiny HTML escape to avoid XSS when rendering the stored value
function escapeHtml(str = "") {
return String(str)
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;")
.replaceAll("'", "&#039;");
}


app.get("/", async (req, res) => {
const value = (await redis.get(REDIS_KEY)) ?? "(no value set yet)";
res.type("html").send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Redis Demo</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 680px; margin: 3rem auto; padding: 0 1rem; }
.card { border: 1px solid #ddd; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
h1 { margin: 0 0 0.5rem; }
form { display: flex; gap: 0.5rem; margin-top: 1rem; }
input[type="text"] { flex: 1; padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid #ccc; }
button { padding: 0.55rem 0.9rem; border: 0; border-radius: 8px; background: #0ea5e9; color: white; cursor: pointer; }
button:hover { filter: brightness(0.95); }
code { background: #f6f8fa; padding: 0.1rem 0.35rem; border-radius: 6px; }
</style>
</head>
<body>
<div class="card">
<h1>🔴 Redis value</h1>
<p>Key: <code>${escapeHtml(REDIS_KEY)}</code></p>
<p><strong>Current:</strong> ${escapeHtml(value)}</p>
<form method="POST" action="/submit">
<input name="value" type="text" placeholder="Type a new value" required />
<button type="submit">Save</button>
</form>
</div>
</body>
</html>`);
});


app.get("/api/value", async (_req, res) => {
const value = (await redis.get(REDIS_KEY)) ?? null;
res.json({ key: REDIS_KEY, value });
});


app.post("/submit", async (req, res) => {
const { value } = req.body;
await redis.set(REDIS_KEY, String(value ?? ""));
res.redirect("/");
});


const server = app.listen(PORT, () => {
console.log(`Web app listening on http://localhost:${PORT}`);
});


// Graceful shutdown
function shutdown(sig) {
console.log(`${sig} received, shutting down...`);
server.close(async () => {
try { await redis.quit(); } catch {}
process.exit(0);
});
}
["SIGINT", "SIGTERM"].forEach((s) => process.on(s, () => shutdown(s)));