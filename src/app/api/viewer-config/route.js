// Settings the 3D viewer needs before Unity starts. Asked for only when a visitor opens a specimen,
// so the password isn't written into every page. It still reaches the browser, because Unity sends
// it to the content server from there; the content server's README accepts that for dawi_unity.
export const dynamic = "force-dynamic";

export function GET() {
  const password = process.env.DAWI_UNITY_PASSWORD;
  if (!password) {
    console.error("[viewer-config] DAWI_UNITY_PASSWORD is not set, so Unity can't load specimens.");
    return Response.json({ error: "The viewer isn't configured." }, { status: 503 });
  }
  return Response.json({ password }, { headers: { "Cache-Control": "no-store" } });
}
