/**
 * Authenticated fetch wrapper.
 * Automatically attaches the stored JWT token as a Bearer Authorization header
 * on every request to /api/* endpoints.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('hr_pulse_v8_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
}
