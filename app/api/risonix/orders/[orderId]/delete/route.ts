import { commerceErrorResponse, deleteUnpaidRisonixOrder } from "@/app/risonix/commerce";
import { requireRisonixControl } from "@/app/risonix/license-api";

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    await requireRisonixControl(request, true);
    const { orderId } = await context.params;
    await deleteUnpaidRisonixOrder(orderId);
    return Response.json({ ok: true });
  } catch (error) {
    return commerceErrorResponse(error);
  }
}
