import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const gameName = process.env.GAME_NAME || "Enter_Paneer";

  try {
    console.log(`Looking up amusement by name: ${gameName}`);

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API key not configured on server");
      return NextResponse.json({
        id: 0,
        name: gameName,
        group_id: 8,
      });
    }

    const baseUrl = process.env.API_URL || "http://localhost:8000/api";
    console.log(`API URL: ${baseUrl}`);

    if (process.env.NODE_ENV === "development") {
      console.log("Development mode: Using consistent amusement ID");
      return NextResponse.json({
        id: 0,
        name: gameName,
        group_id: 8,
      });
    }

    const response = await fetch(
      `${baseUrl}/amusements?name=${encodeURIComponent(gameName)}`,
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

    let amusement = null;
    if (Array.isArray(data.data)) {
      amusement = data.data.find((a: { name: string }) => a.name === gameName);
    } else if (data.name && data.name === gameName) {
      amusement = data;
    }

    if (!amusement) {
      return NextResponse.json(
        { error: "Amusement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(amusement);
  } catch (error) {
    console.error("Amusement lookup error:", error);

    if (process.env.NODE_ENV === "development") {
      console.warn("Using consistent amusement ID for development");
      return NextResponse.json({
        id: 0,
        name: gameName,
        group_id: 8,
      });
    }

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
