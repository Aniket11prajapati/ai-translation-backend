import { client } from '../config/openai.js';
import fs from 'fs';
import path from 'path';

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


async function speechToText(audioFileName) {
    try {
        const speechFilePath = path.resolve(`./public/audio/${audioFileName}`);
        console.log('speechFilePath:', speechFilePath);
        if (!fs.existsSync(speechFilePath)) {
            throw new Error('Audio file not found. Please check the file path.');
        }
        // Use OpenAI Whisper API to transcribe the audio
        const transcription = await client.audio.transcriptions.create({
            file: fs.createReadStream(speechFilePath),
            model: "whisper-1",
        });
        return transcription.text;
    } catch (error) {
        console.error('Error in Speech-to-Text:', error.message);
        throw new Error('Speech-to-Text conversion failed. Please ensure the audio file is valid and try again.');
    }
}
async function textToSpeech(systemPrompt='you are a helpful assistant', userPrompt, modelName) {
    
}


export { askQuestionToAI, speechToText, textToSpeech};
