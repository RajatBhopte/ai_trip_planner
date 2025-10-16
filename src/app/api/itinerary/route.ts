import { NextRequest } from "next/server";

type Body = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  interests?: string;
  travelers?: number;
  budgetLevel?: "low" | "medium" | "high";
};

function basicPlanner(body: Body): string {
  const days = 3;
  const destination = body.destination || "your destination";
  const interests = (body.interests || "sightseeing")
    .split(",")
    .map((s) => s.trim());

  const lines: string[] = [];
  lines.push(`Trip to ${destination}`);
  if (body.startDate || body.endDate) {
    lines.push(`Dates: ${body.startDate || "TBD"} → ${body.endDate || "TBD"}`);
  }
  if (body.travelers) {
    lines.push(`Travelers: ${body.travelers}`);
  }
  if (body.budgetLevel) {
    lines.push(`Budget: ${body.budgetLevel}`);
  }
  lines.push("");

  for (let i = 1; i <= days; i++) {
    const focus = interests[(i - 1) % interests.length] || "sightseeing";
    lines.push(`Day ${i}`);
    lines.push(`- Morning: ${focus} highlight in ${destination}`);
    lines.push(`- Afternoon: Explore local neighborhoods and cafes`);
    lines.push(`- Evening: Recommended dinner spot and a scenic walk`);
    lines.push("");
  }
  lines.push("Tips: Buy local transit pass, book key attractions in advance.");
  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      // Optional: call OpenAI. Keep a local fallback regardless.
      try {
        const prompt = `Create a concise ${
          body.startDate && body.endDate ? "day-wise" : "activity-wise"
        } itinerary for ${body.destination ?? "a destination"}. Interests: ${
          body.interests ?? "general"
        }. Travelers: ${body.travelers ?? 1}. Budget: ${
          body.budgetLevel ?? "medium"
        }.`;
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a helpful travel planner." },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            return Response.json({ plan: content });
          }
        }
      } catch {}
    }

    // Try Google Gemini if OpenAI is not configured
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `Create a concise ${
          body.startDate && body.endDate ? "day-wise" : "activity-wise"
        } itinerary for ${body.destination ?? "a destination"}. Interests: ${
          body.interests ?? "general"
        }. Travelers: ${body.travelers ?? 1}. Budget: ${
          body.budgetLevel ?? "medium"
        }.`;
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }],
                },
              ],
            }),
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          const plan =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            data?.candidates?.[0]?.content?.parts
              ?.map((p: any) => p?.text)
              .filter(Boolean)
              .join("\n");
          if (plan) {
            return Response.json({ plan });
          }
        }
      } catch {}
    }

    const plan = basicPlanner(body);
    return Response.json({ plan });
  } catch {
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: NextRequest) {
  // Streaming demo: emits a simple 3-chunk plan
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination") || "your destination";
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const chunks = [
        `Trip to ${destination}\n\n`,
        `Day 1\n- Morning: Old town walk\n- Afternoon: Museum visit\n\n`,
        `Day 2\n- Morning: Local market\n- Evening: Sunset viewpoint\n`,
      ];
      let i = 0;
      const iv = setInterval(() => {
        if (i >= chunks.length) {
          clearInterval(iv);
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(chunks[i++]));
      }, 350);
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
