/**
 * Service for looking up amusement IDs by name
 */

export interface AmusementLookupResult {
  success: boolean;
  id?: number;
  name?: string;
  group_id?: number;
  error?: string;
}

/**
 * Looks up an amusement ID by name
 * @param amusementName The name of the amusement to look up
 * @returns Promise with the lookup result
 */
export async function lookupAmusementByName(
  amusementName: string
): Promise<AmusementLookupResult> {
  try {
    console.log(`Looking up amusement by name: ${amusementName}`);

    // Make API call to the server-side endpoint
    const response = await fetch(
      `/api/amusements/lookup?name=${encodeURIComponent(amusementName)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log response status for debugging
    console.log(`Lookup response status: ${response.status}`);

    // Get the response text for debugging
    const responseText = await response.text();
    console.log(`Lookup response text: ${responseText.substring(0, 200)}`);

    // Parse the JSON response
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Failed to parse JSON response:", responseText);
      throw new Error("Invalid JSON response from API");
    }

    // Handle non-successful responses
    if (!response.ok) {
      throw new Error(
        data?.error ||
          data?.message ||
          `Lookup failed with status: ${response.status}`
      );
    }

    // Return the amusement ID and details
    return {
      success: true,
      id: data.id,
      name: data.name,
      group_id: data.group_id,
    };
  } catch (error) {
    console.error("Amusement lookup error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lookup failed",
    };
  }
}
