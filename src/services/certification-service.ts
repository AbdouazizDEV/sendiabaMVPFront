/** Deterministic display id for authenticity block — replace with API field later. */
export class CertificationService {
  buildCertId(productId: string): string {
    const seed = productId
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return `SND-${productId.toUpperCase()}-${(seed * 7919) % 10000}`;
  }
}
