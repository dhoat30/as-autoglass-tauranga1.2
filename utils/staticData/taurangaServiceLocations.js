export const TAURANGA_SERVICE_LOCATIONS = [
    { location: "Tauranga Central", position: [-37.6824248, 176.1677505] },
  { location: "Tauranga South", position: [-37.703961, 176.1606532] },
  { location: "Gate Pā", position: [-37.7163237, 176.1383608] },
  { location: "Greerton", position: [-37.7262116, 176.1327861] },
  { location: "Pyes Pā", position: [-37.7455968, 176.124861] },
  { location: "Ōmokoroa", position: [-37.6559615, 176.0218111] },
  { location: "Whakamārama", position: [-37.669, 176.001] },
  { location: "Te Puna", position: [-37.6843423, 176.0746896] },
  { location: "Bethlehem", position: [-37.695864, 176.1131816] },
  { location: "Matua", position: [-37.6667906, 176.1247693] },
  { location: "Ōtūmoetai", position: [-37.6717267, 176.1402406] },

  { location: "Tauriko", position: [-37.7365949, 176.1034402] },
  { location: "Welcome Bay", position: [-37.7285725, 176.1828164] },
  { location: "Mount Maunganui", position: [-37.6380218, 176.1838841] },
  { location: "Pāpāmoa Beach", position: [-37.6972669, 176.2848286] },
  { location: "Te Puke", position: [-37.7853294, 176.3270238] },
];

export const normalizeLocationName = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function findTaurangaServiceLocation(name) {
  const normalizedName = normalizeLocationName(name);
  return TAURANGA_SERVICE_LOCATIONS.find(
    (item) => normalizeLocationName(item.location) === normalizedName,
  );
}
