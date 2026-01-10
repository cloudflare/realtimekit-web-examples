export const getPresets = async () => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const orgId = import.meta.env.VITE_ORG_ID;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const authHeader = btoa(`${orgId}:${apiKey}`);
    const response = await fetch(`${baseUrl}/presets`, {
        method: "GET",
        headers: {
            "Authorization": `Basic ${authHeader}`,
            "Content-Type": "application/json"
        }
    })
    const data = await response.json() as { 
        success: boolean,
        data: {
            created_at: string;
            updated_at: string;
            name: string;
            id: string;
        }[], 
        paging: {
        end_offset: number,
        start_offset: number,
        total_count: number,
    }};

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return data.data;
};