/**
 *  * VECTAETOS — Negative Epistemic Filter
  * Cloudflare Worker
   * -----------------------------------
    * Tento worker úmyselne NEPOSKYTUJE odpovede.
     * Pracuje výhradne vylučovaním, hranicami a apóriou.
      */

      /* =========================
         SYSTEM PROMPT (KANONICKÝ)
            ========================= */

            const SYSTEM_PROMPT = `
            You are an epistemic negative filter.

            You do NOT provide advice, instructions, or solutions.
            You operate by exclusion, boundary-setting, and epistemic humility.

            Your task is to:
            - explain what should NOT be done
            - name contradictions, traps, and false framings
            - identify when silence is more truthful than speech

            If a question is malformed, dangerous, manipulative, or premature:
            - refuse clearly
            - explain WHY refusal or silence is necessary
            - invite reformulation without suggesting content

            Never give step-by-step guidance.
            Never optimize outcomes.
            Never claim certainty.

            Silence is a valid response when it preserves truth.
            `;

            /* =========================
               WORKER ENTRY POINT
                  ========================= */

                  export default {
                    async fetch(req, env) {
                        const url = new URL(req.url);

                            /* === ISSUE TOKEN (24h) === */
                                if (url.pathname === "/api/token") {
                                      const exp = Date.now() + 24 * 60 * 60 * 1000;
                                            const token = btoa(exp + ":" + env.TOKEN_SECRET);

                                                  return json({ token });
                                                      }

                                                          /* === CHAT ENDPOINT === */
                                                              if (url.pathname === "/api/chat") {
                                                                    let body;
                                                                          try {
                                                                                  body = await req.json();
                                                                                        } catch {
                                                                                                return json({ reply: "Otázka nemá čitateľnú formu." });
                                                                                                      }

                                                                                                            const input = (body.input || "").trim();
                                                                                                                  const token = body.token || null;

                                                                                                                        /* --- TOKEN CHECK (AK EXISTUJE) --- */
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

                                                                                                                                                                                                                                                                    /* --- BEZPEČNOSTNÝ REZ (LEN KVÔLI OTÁZKE) --- */
                                                                                                                                                                                                                                                                          if (/(drogy|zabiť|ublížiť|návod|ako presne)/i.test(input)) {
                                                                                                                                                                                                                                                                                  return json({
                                                                                                                                                                                                                                                                                            reply:
                                                                                                                                                                                                                                                                                                        "Táto otázka smeruje k poškodeniu alebo inštrukcii. Tento priestor také otázky neobsluhuje. Skús ju preformulovať bez žiadosti o postup."
                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                                            /* --- NEGATÍVNY EPISTEMICKÝ FILTER (BEZ AI) --- */
                                                                                                                                                                                                                                                                                                                                  const reply = negativeEpistemicResponse(input);

                                                                                                                                                                                                                                                                                                                                        return json({ reply });
                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                return new Response("Not found", { status: 404 });
                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                  };

                                                                                                                                                                                                                                                                                                                                                  /* =========================
                                                                                                                                                                                                                                                                                                                                                     NEGATIVE RESPONSE LOGIC
                                                                                                                                                                                                                                                                                                                                                        ========================= */

                                                                                                                                                                                                                                                                                                                                                        function negativeEpistemicResponse(input) {
                                                                                                                                                                                                                                                                                                                                                          if (!input) {
                                                                                                                                                                                                                                                                                                                                                              return "Bez otázky niet hranice.";
                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                  if (input.length < 12) {
                                                                                                                                                                                                                                                                                                                                                                      return "Otázka je príliš úzka na to, aby bola pravdivá.";
                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                          if (/\b(čo mám robiť|aké riešenie|najlepšia možnosť)\b/i.test(input)) {
                                                                                                                                                                                                                                                                                                                                                                              return (
                                                                                                                                                                                                                                                                                                                                                                                    "Táto otázka predpokladá, že existuje bezpečné riešenie. " +
                                                                                                                                                                                                                                                                                                                                                                                          "V tomto bode je presnejšie skúmať, ktoré smery by boli chybou."
                                                                                                                                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                  if (/\b(áno alebo nie|správne alebo nesprávne)\b/i.test(input)) {
                                                                                                                                                                                                                                                                                                                                                                                                      return (
                                                                                                                                                                                                                                                                                                                                                                                                            "Otázka je postavená ako falošná dichotómia. " +
                                                                                                                                                                                                                                                                                                                                                                                                                  "Realita, ktorú skúmaš, sa do nej nezmestí."
                                                                                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                                                                                                                                                          /* === MLČANIE S DÔVODOM === */
                                                                                                                                                                                                                                                                                                                                                                                                                            if (input.includes("?") && input.length > 120) {
                                                                                                                                                                                                                                                                                                                                                                                                                                return (
                                                                                                                                                                                                                                                                                                                                                                                                                                      "Na túto otázku by odpoveď vytvorila ilúziu istoty. " +
                                                                                                                                                                                                                                                                                                                                                                                                                                            "Presnejšie je zatiaľ mlčať."
                                                                                                                                                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                                                                                                                                                  }

                                                                                                                                                                                                                                                                                                                                                                                                                                                    /* === DEFAULT NEGATIVE FRAME === */
                                                                                                                                                                                                                                                                                                                                                                                                                                                      return (
                                                                                                                                                                                                                                                                                                                                                                                                                                                          "Skôr než sa pýtať, čo robiť, je potrebné vymedziť, " +
                                                                                                                                                                                                                                                                                                                                                                                                                                                              "čo by v tejto situácii bolo chybou, skratkou alebo únikom."
                                                                                                                                                                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                /* =========================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                   JSON HELPER
                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ========================= */

                                                                                                                                                                                                                                                                                                                                                                                                                                                                      function json(obj) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        return new Response(JSON.stringify(obj), {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            headers: { "Content-Type": "application/json" }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              }
