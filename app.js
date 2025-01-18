import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { askQuestionToAI, speechToText, textToSpeech } from './utils/helper.js';
import { client } from './config/openai.js';
import path from 'path';
import fs from 'fs';
const app = express();
const port = process.env.PORT;

async function main() {
    try {
        // const {yourLang='en', toLang} = req.body

        //stt by whisper aniket

        //text to translated language text Zainul 

        //tts Yash Gupta 

        // const response = await askQuestionToAI(
        //     'you are a helpful assistant',
        //     'write a haiku on cats',
        //     'gpt-4o-mini'
        // )
        // console.log('response', response)

        const speechFilePath = path.resolve(`./public/audio/${Date.now()}_speech.mp3`);
        console.log('speechFilePath', speechFilePath)

        //stt
        const transcription = await client.audio.transcriptions.create({
            file: fs.createReadStream(speechFilePath),
            model: "whisper-1",
        });


        //tts
        const mp3 = await client.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: transcription.text,
        });
        console.log('mp3', mp3)
        const buffer = Buffer.from(await mp3.arrayBuffer());
        console.log('buffer', buffer)
        const writing = await fs.promises.writeFile(speechFilePath, buffer);
        console.log('writing', writing)

        console.log(transcription.text);

    } catch (error) {
        console.log('error=>', error)
    }

}


app.get('/translate', async (req, res) => {
    try {
        
        const {
            fromLang,
            toLang,
            audioFile
        } = req.body;

        if (!fromLang || !toLang || !audioFile) {
            return res.status(400).json({ error: 'fromLang, toLang, audioFile is required' });
        }

        //First convert speech to text this will be done by aniket prajapati
        const speechText = await speechToText();

        //Second convert text to speech this will be done by yash gupta
        const textToSpeech = await textToSpeech();
        
        //Third give suggestions this will be done by zainul khan
        const textConversion = await askQuestionToAI();
        return res.status(200).json({
            textConversion,
            textToSpeech 
        });

    } catch (error) {

        console.log('error', error);
        return res.status(500).json({error: 'Something went wrong'});
    }
})

app.listen(port, (error) => {
    if (error) {
        console.log('errorinlistenting', port);
    } else {
        console.log(`Listening to app ${port}`)
    }
})
