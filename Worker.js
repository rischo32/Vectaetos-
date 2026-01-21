export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    // === TOKEN ENDPOINT ===
    if (url.pathname === "/api/token") {
      const exp = Date.now() + 24 * 60 * 60 * 1000; // 24h
      const token = btoa(exp + ":" + env.TOKEN_SECRET);

      return new Response(JSON.stringify({ token }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // === CHAT ENDPOINT ===
    if (url.pathname === "/api/chat") {
      const { input, token } = await req.json();

      // overenie tokenu (ak existuje)
      if (token) {
        try {
          const decoded = atob(token).split(":");
          const exp = Number(decoded[0]);
          const secret = decoded[1];

          if (Date.now() > exp || secret !== env.TOKEN_SECRET) {
            return json({
              reply: "Prístup vypršal. To je informácia, nie chyba."
            });
          }
        } catch {
          return json({ reply: "Token je neplatný." });
        }
      }

      // bezpečnostný filter (len kvôli otázke)
      if (/drogy|zabiť|ublížiť|návod/i.test(input)) {
        return json({
          reply:
            "Táto otázka smeruje k poškodeniu. Skús ju preformulovať bez inštrukcie."
        });
      }

      // zatiaľ testovacia odpoveď
      return json({
        reply:
          "Toto je test infraštruktúry. Model bude pripojený v ďalšom kroku."
      });
    }

    return new Response("Not found", { status: 404 });
  }
};

function json(obj) {
  return new Response(JSON.stringify(obj), {
    headers: { "Content-Type": "application/json" }
  });
}
