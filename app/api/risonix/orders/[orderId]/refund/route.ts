import { commerceErrorResponse, requestRisonixRefund } from "@/app/risonix/commerce";
import { requireRisonixControl } from "@/app/risonix/license-api";

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    await requireRisonixControl(request, true);
    const { orderId } = await context.params;
    await requestRisonixRefund(orderId);
    return Response.json({ ok: true }, { status: 202 });
  } catch (error) {
    return commerceErrorResponse(error);
  }
}
