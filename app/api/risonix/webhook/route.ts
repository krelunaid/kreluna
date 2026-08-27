import { commerceErrorResponse, handleRisonixStripeWebhook } from "@/app/risonix/commerce";

export async function POST(request: Request) {
  try {
    const result = await handleRisonixStripeWebhook(request);
    return Response.json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    return commerceErrorResponse(error);
  }
}
