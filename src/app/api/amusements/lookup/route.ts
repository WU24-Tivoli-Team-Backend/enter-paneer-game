import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Amusement name is required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API key not configured on server");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.API_URL || "http://localhost:8000/api";

    const response = await fetch(
      `${baseUrl}/amusements/find-by-name?name=${encodeURIComponent(name)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-API-Key": apiKey,
        },
      }
    );

    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Response text:", responseText);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to lookup amusement" },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid response from API" },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in amusement lookup:", error);
    return NextResponse.json(
      { error: "Server error during amusement lookup" },
      { status: 500 }
    );
  }
}
