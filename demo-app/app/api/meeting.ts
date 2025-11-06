export const createMeeting = async (name: string) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const orgId = import.meta.env.VITE_ORG_ID;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const authHeader = btoa(`${orgId}:${apiKey}`);
    const response = await fetch(`${baseUrl}/meetings`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${authHeader}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: name
        })
    })
    
    const data = await response.json() as { message: string, data: { id: string } };
    
    if (!response.ok) {
        throw new Error(data.message || `API request failed with status ${response.status}`);
    }
    
    return data;
}
