require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // Make sure to install node-fetch if not already installed

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.'));

app.post('/generate-blog', async (req, res) => {
    const { topic, length, keyword, audience, photoIdea, photoCount } = req.body;
    let prompt = `Write a blog post about ${topic}. Length: ${length} characters maximum. Keyword: ${keyword}. Audience: ${audience}. If ${photoIdea} is nonzero, include ${photoCount} photo ideas.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Unknown error occurred');
        }

        const generatedText = responseData.choices[0].message.content;
        console.log('Generated Text:', generatedText);
        res.json({ result: generatedText });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        
        // Detailed error logging
        if (error.response) {
            console.error('Response:', error.response.status, error.response.statusText);
            console.error('Response data:', error.response.data);
        }

        const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
        console.error('Prompt:', prompt);
        res.status(500).json({ error: 'Error generating blog post', details: errorMessage });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
