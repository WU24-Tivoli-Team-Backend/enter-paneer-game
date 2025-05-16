import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the name query parameter
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Amusement name is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("API key not configured on server");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.API_URL || "http://localhost:8000/api";

    // Log the request details for debugging
    console.log(`Looking up amusement by name: ${name}`);
    console.log(`Using API key: ${apiKey.substring(0, 5)}...`);
    console.log(`API URL: ${baseUrl}`);

    const response = await fetch(
      `${baseUrl}/amusements/find-by-name?name=${encodeURIComponent(name)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-API-Key": apiKey,
        },
      }
    );

    const text = await response.text();
    console.log("Response status:", response.status);
    console.log("Response text:", text?.substring(0, 200));

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      return NextResponse.json(
        { error: "Invalid JSON response from external API" },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        `Lookup failed with status: ${response.status}`;
      console.error("Error from API:", errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Amusement lookup error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error during amusement lookup",
      },
      { status: 500 }
    );
  }
}
