import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q"); // city name or "lat,lon"
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { message: "Missing OPENWEATHER_API_KEY on server" },
      { status: 500 }
    );
  }
  if (!q) {
    return Response.json({ message: "Missing q parameter" }, { status: 400 });
  }

  try {
    const isCoord = /-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?/.test(q);
    let url: string;
    if (isCoord) {
      const [lat, lon] = q.split(",").map((s) => s.trim());
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        q
      )}&units=metric&appid=${apiKey}`;
    }
    const resp = await fetch(url);
    const data = await resp.json();
    return Response.json(data, { status: resp.status });
  } catch {
    return Response.json({ message: "Weather fetch failed" }, { status: 500 });
  }
}
