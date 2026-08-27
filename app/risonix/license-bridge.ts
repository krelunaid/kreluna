export type RisonixLicense = {
  license_id: string;
  status: string;
  device_label: string | null;
  app_version: string | null;
  online: boolean;
  activated_at: string | null;
  last_seen: string | null;
};

function configuration() {
  const apiUrl = process.env.RISONIX_LICENSE_API_URL?.replace(/\/$/, "");
  const siteSecret = process.env.RISONIX_SITE_SECRET;
  if (!apiUrl || !siteSecret) {
    throw new Error("Il collegamento al server licenze non è ancora pubblicato.");
  }
  return { apiUrl, siteSecret };
}

export async function loadRisonixLicenses(email: string): Promise<RisonixLicense[]> {
  const { apiUrl, siteSecret } = configuration();
  const response = await fetch(`${apiUrl}/v1/customer/licenses`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-kreluna-site-secret": siteSecret,
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Il server licenze non è disponibile.");
  return (await response.json()) as RisonixLicense[];
}

export async function releaseRisonixDevice(email: string, licenseId: string): Promise<void> {
  const { apiUrl, siteSecret } = configuration();
  const safeLicenseId = encodeURIComponent(licenseId);
  const response = await fetch(
    `${apiUrl}/v1/customer/licenses/${safeLicenseId}/release-device`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-kreluna-site-secret": siteSecret,
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error("Non è stato possibile liberare il dispositivo.");
}
