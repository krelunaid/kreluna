import { handleLicenseApi } from "@/app/risonix/license-api";

type Context = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, context: Context) {
  return handleLicenseApi(request, (await context.params).path);
}

export async function POST(request: Request, context: Context) {
  return handleLicenseApi(request, (await context.params).path);
}
