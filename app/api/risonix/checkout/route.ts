import { chatGPTSignInPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { commerceErrorResponse, createRisonixCheckout } from "@/app/risonix/commerce";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.redirect(new URL(chatGPTSignInPath("/risonix/acquista"), request.url), 303);
  try {
    const checkoutUrl = await createRisonixCheckout(request, user);
    return Response.redirect(checkoutUrl, 303);
  } catch (error) {
    const response = commerceErrorResponse(error);
    const status = response.status;
    if (status >= 500) return Response.redirect(new URL("/risonix/acquista?errore=configurazione", request.url), 303);
    return Response.redirect(new URL("/risonix/acquista?errore=richiesta", request.url), 303);
  }
}
