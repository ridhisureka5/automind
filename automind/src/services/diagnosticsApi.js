const BASE_URL = "http://localhost:8000/api";


// ML DATA
export const fetchDiagnostics = async () => {

  const res = await fetch(`${BASE_URL}/diagnostics`);

  if (!res.ok) {
    throw new Error("Diagnostics Failed");
  }

  return res.json();
};


// ALERTS
export const fetchAlerts = async () => {

  const res = await fetch(`${BASE_URL}/alerts`);

  if (!res.ok) {
    throw new Error("Alerts Failed");
  }

  return res.json();
};
