interface ClinicalAssistantResponse {
  content: string;
  source: 'gemini' | 'fallback';
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

/** Sends a clinical-assistant question to the protected backend API. */
export async function requestClinicalResponse(query: string): Promise<ClinicalAssistantResponse> {
  const response = await fetch(`${apiBaseUrl}/api/clinical-assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Clinical assistant request failed');
  }

  return response.json() as Promise<ClinicalAssistantResponse>;
}
