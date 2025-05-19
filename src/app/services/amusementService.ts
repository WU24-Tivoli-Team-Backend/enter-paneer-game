/**
 * Interface for amusement lookup result
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

    const response = await fetch(
      `/api/amusements/lookup?name=${encodeURIComponent(amusementName)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log(`Lookup response status: ${response.status}`);

    const responseText = await response.text();
    console.log(`Lookup response text: ${responseText.substring(0, 200)}`);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("Failed to parse JSON response:", responseText);
      throw new Error("Invalid JSON response from API");
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          data?.message ||
          `Lookup failed with status: ${response.status}`
      );
    }

    if (data.id !== undefined) {
      return {
        success: true,
        id: data.id,
        name: data.name,
        group_id: data.group_id,
      };
    }

    if (Array.isArray(data?.data)) {
      const amusement = data.data.find(
        (a: { id: number; name: string; group_id: number }) =>
          a.name.toLowerCase() === amusementName.toLowerCase()
      );
      if (amusement) {
        return {
          success: true,
          id: amusement.id,
          name: amusement.name,
          group_id: amusement.group_id,
        };
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.warn("Using fallback amusement ID for development");
      return {
        success: true,
        id: 0,
        name: amusementName,
        group_id: 8,
      };
    }

    return {
      success: false,
      error: "Amusement not found",
    };
  } catch (error) {
    console.error("Amusement lookup error:", error);
    if (process.env.NODE_ENV === "development") {
      console.warn("Using fallback amusement ID for development due to error");
      return {
        success: true,
        id: 0,
        name: amusementName,
        group_id: 8,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lookup failed",
    };
  }
}
