export const dynamic = "force-static";
export const revalidate = 10;

export async function GET() {
  return Response.json({ time: new Date().toLocaleTimeString() });
}

//caching will only works with get methods
//other HTTP methods (post, patch, delete) are never cached
