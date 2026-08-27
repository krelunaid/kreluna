import { listRisonixOrdersForControl, commerceErrorResponse } from "@/app/risonix/commerce";
import { requireRisonixControl } from "@/app/risonix/license-api";

export async function GET(request: Request) {
  try {
    await requireRisonixControl(request);
    return Response.json(await listRisonixOrdersForControl());
  } catch (error) {
    return commerceErrorResponse(error);
  }
}
