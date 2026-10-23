import { NextResponse } from "next/server";
import { MAX_SENTENCES, SAMPLE, summarize, topKeywords } from "@/lib/summarizer";

// Stateless JSON-RPC MCP endpoint over the same extractive logic the page runs. No model, no storage.

type RpcRequest = { id?: number | string | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const TOOLS = [
  {
    name: "summarize",
    description: `Keep the first N sentences (1-${MAX_SENTENCES}) of the text and list its recurring words. Extractive only.`,
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" }, sentences: { type: "number", minimum: 1, maximum: MAX_SENTENCES } },
      required: ["text"],
    },
  },
  {
    name: "keywords",
    description: "Rank words of four or more letters by how often they appear",
    inputSchema: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
  },
  { name: "get_sample", description: "Return the sample text the page loads", inputSchema: { type: "object", properties: {} } },
];

class RpcError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

function requireText(args: Record<string, unknown>) {
  if (typeof args.text !== "string") throw new RpcError(-32602, "Argument text must be a string");
  return args.text;
}

function callTool(name: string | undefined, args: Record<string, unknown> = {}) {
  switch (name) {
    case "summarize":
      return summarize(requireText(args), args.sentences === undefined ? 2 : Number(args.sentences));
    case "keywords":
      return { keywords: topKeywords(requireText(args)) };
    case "get_sample":
      return { text: SAMPLE };
    default:
      throw new RpcError(-32602, `Unknown tool: ${String(name)}`);
  }
}

export async function POST(request: Request) {
  let id: RpcRequest["id"] = null;
  try {
    const body = (await request.json()) as RpcRequest;
    id = body.id ?? null;
    let result: unknown;
    switch (body.method) {
      case "initialize":
        result = {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "Text Summarizer", version: "1.0.0" },
        };
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call":
        result = callTool(body.params?.name, body.params?.arguments);
        break;
      default:
        throw new RpcError(-32601, `Unknown method: ${String(body.method)}`);
    }
    return NextResponse.json({ jsonrpc: "2.0", id, result });
  } catch (error) {
    const code = error instanceof RpcError ? error.code : -32700;
    const message = error instanceof RpcError ? error.message : "Parse error";
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } }, { status: 400 });
  }
}
