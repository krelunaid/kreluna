import { getChatGPTUser } from "@/app/chatgpt-auth";
import { releaseRisonixDevice } from "@/app/risonix/license-bridge";

export async function POST(
  request: Request,
  context: { params: Promise<{ licenseId: string }> },
) {
  const user = await getChatGPTUser();
  if (!user) return new Response("Accesso richiesto", { status: 401 });
  const { licenseId } = await context.params;
  try {
    await releaseRisonixDevice(user.email, licenseId);
    return Response.redirect(new URL("/risonix/account?released=1", request.url), 303);
  } catch {
    return Response.redirect(new URL("/risonix/account?release_error=1", request.url), 303);
  }
}
