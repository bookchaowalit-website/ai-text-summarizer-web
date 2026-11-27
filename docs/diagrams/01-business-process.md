# 01 — Business process (As-Is / To-Be)

ai-text-summarizer-web (Text Summarizer) คือเครื่องมือฝั่ง client ที่ตัดประโยคแรก N ประโยค (extractive ไม่มี LLM) พร้อมนับคำและคำสำคัญ สำหรับผู้เยี่ยมชม portfolio และคนที่ต้องการสรุปหยาบ ๆ

Last reviewed: 2026-11-28 · commit `768758e`

## As-Is (จากโค้ดวันนี้)

```mermaid
flowchart TD
  OPEN["เปิดหน้าเว็บ: โหลดข้อความตัวอย่าง (SAMPLE)"] --> INPUT["ผู้ใช้วาง/พิมพ์ข้อความ + เลือก N (1-10)"]
  INPUT --> SPLIT["splitSentences: แบ่งตามเครื่องหมาย . ! ?"]
  SPLIT --> SUM["summarize: ประโยคแรก N ประโยค + นับประโยค/คำ"]
  INPUT --> KW["topKeywords: คำ >= 4 ตัวอักษร ความถี่สูงสุด 8 (ไม่มี stop-word)"]
  SUM --> VIEW["แสดง extract + counts + keywords"]
  KW --> VIEW
  VIEW --> COPY["Copy extract: navigator.clipboard.writeText"]
  VIEW --> RESET["โหลดข้อความตัวอย่างใหม่ / Clear (ล้างทันที ไม่มี Undo)"]
  MCP["POST /api/mcp: summarize, keywords, get_sample"] --> LIB["ใช้โค้ด lib/summarizer.ts เดียวกับหน้าเว็บ"]
  LIB -->|"text ไม่ใช่ string"| E400["JSON-RPC error -32602 (HTTP 400)"]
```

Sources: `app/page.tsx`, `lib/summarizer.ts`, `app/api/mcp/route.ts`, `PRODUCT.md`

ข้อเท็จจริงจากโค้ด/เอกสาร:

- ไม่มีการเก็บข้อมูล บัญชี หรือ analytics; ภาษาไทยไม่ถูกตัดคำ (แบ่งประโยคด้วยเครื่องหมาย . ! ? เท่านั้น)
- error ฝั่งเว็บและ server ไป Sentry เมื่อมี `NEXT_PUBLIC_SENTRY_DSN` (`lib/sentry.ts`); `PRODUCT.md` ว่าตั้งบน Vercel แล้ว แต่ใช้ได้เมื่อ deploy ครั้งถัดไป [ต้องยืนยัน]
- Clear ล้างข้อความทันทีโดยไม่มี Undo (`PRODUCT.md` §Known limits)

## To-Be

ไม่มี To-Be ที่เขียนไว้

## Gap

| ID | As-Is → To-Be | Status | Owner | Evidence |
|---|---|---|---|---|
| G1 | Vercel Git link ชี้ repo ชื่อเก่า push `main` จึงไม่ deploy (deploy ด้วย CLI เท่านั้น) → owner เชื่อม Vercel Git กับ repo นี้ | todo | owner | `PRODUCT.md` §Live URL and deploy state (owner action D9) |
| G2 | ไม่มี To-Be ของกระบวนการ → owner กำหนด (หรือยืนยันว่าแอปนี้คงขอบเขตปัจจุบัน) | decide | owner | ไม่มีใน `PRODUCT.md` / `docs/` |

## Open questions

- production ตามหลัง `main` (ไม่มี Sentry, MCP route แบบ template, ตัวนับคำเดิม) ตาม `PRODUCT.md` [ต้องยืนยัน]
