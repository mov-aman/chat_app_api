import axios from 'axios';

const openAIKey = process.env.OPEN_AI;

export const fetchChatbotResponse = async (prompt) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${openAIKey}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return "Sorry, I'm unable to respond right now.";
    }
};
