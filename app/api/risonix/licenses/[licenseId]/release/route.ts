export async function POST(
  _request: Request,
  _context: { params: Promise<{ licenseId: string }> },
) {
  return Response.json(
    { error: "La licenza è vincolata al primo dispositivo. Contatta l’assistenza Kreluna." },
    { status: 403 },
  );
}
