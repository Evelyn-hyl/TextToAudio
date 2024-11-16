import dotenv from 'dotenv';
import express from 'express';
// import { body } from 'express-validator';
import * as PlayHT from 'playht';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

/** Selected voice details:
 *   {
    "voiceEngine": "PlayHT2.0",
    "id": "s3://voice-cloning-zero-shot/4c627545-b9c0-4791-ae8e-f48f5475247c/bryansaad/manifest.json",
    "name": "Bryan",
    "sampleUrl": "https://peregrine-results.s3.amazonaws.com/euekNIyvT2kURh1CJ3.mp3",
    "language": "English (US)",
    "languageCode": "en-US",
    "gender": "male",
    "ageGroup": "adult",
    "styles": [
      "videos"
    ],
    "isCloned": false
  },
 */
PlayHT.init({
  apiKey: process.env.API_KEY,
  userId: process.env.USER_ID,
  defaultVoiceId: "s3://voice-cloning-zero-shot/4c627545-b9c0-4791-ae8e-f48f5475247c/bryansaad/manifest.json",
  defaultVoiceEngine: 'PlayHT2.0',
});

// body("text").notEmpty().withMessage("Text box cannot be empty"), 
app.post("/api/generate-audio", async (req, res) => {
    try {
      console.log("Request Body: ", req.body);
      console.log("Request body text:", req.body.text);
      const text = req.body.text;

      // validates if text is a string
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Invalid or missing 'text' parameter" });
      }

      const generatedAudio = await PlayHT.generate(text);

      const { audioUrl } = generatedAudio;
      console.log('Audio file url: ', audioUrl);

      res.status(201).json({ audioUrl });
    } catch (error) {
      console.error("Error generating audio: ", error);
      res.status(500).json({ error: "Failed to generate audio" });
    }
})

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
})