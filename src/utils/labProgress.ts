// Registra a conclusão de um laboratório para fins de XP. É best-effort —
// se falhar, não deve travar o fluxo do laboratório (o XP é um bônus).
export async function markLabComplete(token: string | null, labKey: string): Promise<void> {
  if (!token) return;
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/labs/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ labKey }),
    });
  } catch {
    // silencioso de propósito
  }
}

// Heurística para os labs de XSS "self-inflicted", que não têm um
// success:true estruturado — o "sucesso" é o payload realmente executar.
const XSS_PAYLOAD_PATTERN = /<script|on\w+\s*=|javascript:|<svg|<img[^>]+src/i;

export function looksLikeXssPayload(text: string): boolean {
  return XSS_PAYLOAD_PATTERN.test(text);
}
