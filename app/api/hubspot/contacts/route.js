export const dynamic = "force-dynamic";

function toInt(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req) {
  try {
    const token = process.env.HUBSPOT_API_KEY;
    if (!token) {
      return Response.json(
        { ok: false, error: "Missing HUBSPOT_API_KEY" },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      100,
      Math.max(1, toInt(searchParams.get("limit"), 50)),
    );

    const body = {
      filterGroups: [
        {
          filterGroups: [
            {
              filters: [
                { propertyName: "pick_up_address", operator: "HAS_PROPERTY" },
              ],
            },
          ],
        },
      ],
      properties: ["pick_up_address", "firstname"],
      limit,
      sorts: ["-createdate"],
    };

    const hsRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const hsJson = await hsRes.json().catch(() => null);

    if (!hsRes.ok) {
      // Return the exact HubSpot error payload so you can see the real reason
      return Response.json(
        { ok: false, hubspot: hsJson },
        { status: hsRes.status },
      );
    }

    const results = (hsJson?.results || []).map((c) => ({
      id: c.id,
      firstname: c.properties?.firstname || null,
      pick_up_address: c.properties?.pick_up_address || null,
    }));

    return Response.json({ ok: true, results, paging: hsJson?.paging || null });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
