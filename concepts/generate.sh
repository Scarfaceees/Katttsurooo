#!/bin/bash
# Vygeneruje obrázek přes Gemini API.
# Použití: GEMINI_API_KEY=... ./concepts/generate.sh <out.png> "<prompt>" [model]
# Výstup se ukládá do concepts/ a NIKDY se nenasazuje do hry – to je samostatný krok po výběru stylu.
set -euo pipefail

OUT="$1"
PROMPT="$2"
MODEL="${3:-gemini-3.1-flash-image}"
: "${GEMINI_API_KEY:?Nastav GEMINI_API_KEY}"

BODY=$(node -e 'console.log(JSON.stringify({contents:[{parts:[{text:process.argv[1]}]}],generationConfig:{responseModalities:["IMAGE"]}}))' "$PROMPT")

RESP=$(curl -sS -m 300 \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -d "$BODY" \
  "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent")

echo "$RESP" | node -e '
let s = "";
process.stdin.on("data", d => s += d).on("end", () => {
  const j = JSON.parse(s);
  if (j.error) { console.error("ERR", j.error.code, j.error.message.slice(0, 200)); process.exit(1); }
  const parts = j.candidates?.[0]?.content?.parts || [];
  const img = parts.find(p => p.inlineData || p.inline_data);
  if (!img) { console.error("Model nevrátil obrázek:", JSON.stringify(j).slice(0, 300)); process.exit(2); }
  const d = img.inlineData || img.inline_data;
  require("fs").writeFileSync(process.argv[1], Buffer.from(d.data, "base64"));
  console.log("OK", process.argv[1], d.mimeType);
});' "$OUT"
