import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }));
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" });
    const body = await res.json();
    expect(body.id).toBe(7);
    expect(body.result.tools.map((t: { name: string }) => t.name)).toEqual(["summarize", "keywords", "get_sample"]);
  });

  it("summarize runs the same extract as the page", async () => {
    const res = await rpc({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "summarize", arguments: { text: "First one. Second one. Third one.", sentences: 2 } },
    });
    const { result } = await res.json();
    expect(result.top).toBe("First one. Second one.");
    expect(result.sentences).toBe(3);
    expect(result.words).toBe(6);
  });

  it("keywords ranks recurring words", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "keywords", arguments: { text: "data tool data" } } });
    expect((await res.json()).result.keywords).toEqual(["data", "tool"]);
  });

  it("rejects a missing text argument", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "summarize", arguments: {} } });
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error.code).toBe(-32602);
    expect(body.id).toBe(3);
  });

  it("rejects an unknown tool instead of pretending to call it", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "get_data" } });
    expect((await res.json()).error.code).toBe(-32602);
  });

  it("rejects an unknown method and a malformed body", async () => {
    expect((await (await rpc({ jsonrpc: "2.0", id: 5, method: "nope" })).json()).error.code).toBe(-32601);
    const bad = await POST(new Request("http://localhost/api/mcp", { method: "POST", body: "{" }));
    expect((await bad.json()).error.code).toBe(-32700);
  });
});
