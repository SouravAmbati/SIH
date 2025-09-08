import axios from 'axios';

const startCall = async (req, res) => {
   try {
        const response = await axios.post(
            `https://api.openai.com/v1/realtime/sessions`,
            {
                model: "gpt-4o-realtime-preview",
                modalities: ["audio", "text"],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        return res.json({ tempApiKey: response.data.client_secret.value });
    } catch (error) {
        console.error(
            "Error fetching ephemeral key:",
            error.response?.data || error.message
        );
        return res.json(
            { error: error.response?.data || error.message },
            { status: 500 }
        );
    }
}

export {startCall}