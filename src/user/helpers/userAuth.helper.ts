export function getDomainFromEmailId(email: string): string {
  const domain = email.substring(email.lastIndexOf('@') + 1);

  return domain;
}
