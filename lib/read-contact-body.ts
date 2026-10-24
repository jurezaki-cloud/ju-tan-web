/** Bound memory before parsing, including requests without Content-Length. */
export async function readContactBody(request: Request): Promise<unknown> {
  const limit = 32 * 1024;
  if (Number(request.headers.get("content-length")) > limit) {
    throw new RangeError("Contact body too large");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing body");
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new RangeError("Contact body too large");
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    reader.releaseLock();
  }
}
