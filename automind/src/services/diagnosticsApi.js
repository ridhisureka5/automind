export async function fetchDiagnostics() {
  const res = await fetch("http://localhost:8000/api/diagnostics");

  if (!res.ok) {
    throw new Error(`API failed: ${res.status}`);
  }

  const data = await res.json();
  return data;
}
