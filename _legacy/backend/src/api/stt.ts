import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { Request, Response } from 'express';

const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY || '',
    process.env.AZURE_SPEECH_REGION || ''
);
speechConfig.speechRecognitionLanguage = "el-GR";

export const handleSTT = async (req: Request, res: Response) => {
    // In a real scenario, this would handle a buffer from req.body
    // For the blueprint, we show the initialization logic

    console.log("Receiving audio stream for translation...");

    // Mocking the result for the delivery purpose
    const recognizer = new sdk.SpeechRecognizer(speechConfig);

    // Implementation for continuous stream recognition
    recognizer.recognizeOnceAsync(result => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            res.json({ text: result.text });
        } else {
            res.status(500).json({ error: "Failed to recognize speech" });
        }
    });
};
