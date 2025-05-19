import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: "Transactions API endpoint is working" },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get("Authorization")?.split(" ")[1];

    if (!authToken) {
      return NextResponse.json(
        { error: "No JWT token provided" },
        { status: 401 }
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

    const payload = await request.json();

    const baseUrl = process.env.API_URL || "http://localhost:8000/api";

    console.log(`Forwarding request to ${baseUrl}/transactions`);
    console.log("Payload:", payload);

    const response = await fetch(`${baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("Response from external API:", text);

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
        `Transaction failed with status: ${response.status}`;
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Transaction processing error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error during transaction processing",
      },
      { status: 500 }
    );
  }
}
