export const addParticipant = async (name: string, meetingId: string, presetName: string) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const orgId = import.meta.env.VITE_ORG_ID;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const authHeader = btoa(`${orgId}:${apiKey}`);
    const response = await fetch(`${baseUrl}/meetings/${meetingId}/participants`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${authHeader}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            preset_name: presetName,
            custom_participant_id: (Math.random() * 1000).toString()
        })
    })
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || `API request failed with status ${response.status}`);
    }
  
    return data;
}
