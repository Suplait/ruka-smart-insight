export function supplierPageTitle(profile) {
  const name = profile.name.length > 35 ? `${profile.name.slice(0, 32).replace(/\s+\S*$/, "")}…` : profile.name;
  return `${name}: RUT ${profile.rut} | Ruka`;
}
