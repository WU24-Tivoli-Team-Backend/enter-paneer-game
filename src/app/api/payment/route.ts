import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://yrgobank.vip/api/test"
        : "http://localhost:8000/api/test";

    const url = new URL(baseUrl);
    Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));

    console.log(`Making GET request to: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed: ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Request processing failed" },
      { status: 500 }
    );
  }
}
