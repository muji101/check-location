export async function POST({ request }) {
  const { lat, lng } = await request.json();

  // Contoh validasi: koordinat tidak 0 dan dalam range tertentu
  const isValid = (
    lat !== 0 &&
    lng !== 0 &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );

  // Contoh validasi: koordinat tidak boleh 0
  // const isValid = lat !== 0 && lng !== 0;

  return new Response(JSON.stringify({ valid: isValid }), {
    headers: { 'Content-Type': 'application/json' }
  });
}