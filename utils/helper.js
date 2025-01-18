import { client } from '../config/openai.js';

async function askQuestionToAI(systemPrompt='you are a helpful assistant', userPrompt, modelName) {
    try {

        const chatCompletion = await client.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }],
            model: modelName,
        });

        return chatCompletion?.choices[0]?.message?.content
        console.log('chatCompletion', chatCompletion);

    } catch (error) {
        console.log('errorInAi', error);
        throw error;
    }
}

async function speechToText(systemPrompt='you are a helpful assistant', userPrompt, modelName) {

}

async function textToSpeech(systemPrompt='you are a helpful assistant', userPrompt, modelName) {
    
}


export { askQuestionToAI, speechToText, textToSpeech};
