export default function id() {
  const uniqueSeed = Date.now().toString();
  const getUniqueId = () => Cypress._.uniqueId(uniqueSeed);

  return getUniqueId();
}
