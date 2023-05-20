const path = require("path");
const express = require("express");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const player = require("play-sound")();
const app = express();
const fetch = require('isomorphic-fetch');

// Set up Azure Cognitive Services Text to Speech
const speechKey = "a78237149a864882b0c75466fab83131";
const serviceRegion = "eastus";
const speechConfig = sdk.SpeechConfig.fromSubscription(
  speechKey,
  serviceRegion
);
const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

//static files are served
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to trigger speech synthesis
app.get("/", (req, res) => {
  readNews();
  res.sendFile(path.join(__dirname, "public", "index.html")); // Send the HTML file as response
});

const api_url =
  "https://newsapi.org/v2/top-headlines?country=in&apiKey=1116921095d64299b278259fee0c0cca";
const news_url =
  "https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=in&apikey=7e5819fe78caf89ae45180c790366be3";

function textToSpeech(text) {
  synthesizer.speakTextAsync(
    `${text}`,
    (result) => {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        const audioDataStream = sdk.AudioDataStream.fromResult(result);

        // Play speech output
        player.play(Buffer.from(audioDataStream.buffer));
      }
    },
    (error) => {
      console.error(`Speech synthesis error: ${error}`);
    }
  );
}

async function readNews() {
  try {
    const response = await fetch(api_url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const dat = await response.json();

    let newsText =
      "Welcome to Listen up: Empowering the Visually Impaired with an Accessible News Reader.\nThese are the top headlines of today.\n";
    for (const article of dat.articles) {
      const title = article.title;
      const content = article.description;
      newsText += "Title: " + title + "\n" + content + "\n";
    }

    let colnews = "The other trending news of today are\n";
    const response1 = await fetch(news_url);
    if (!response1.ok) {
      throw new Error(`HTTP error! Status: ${response1.status}`);
    }
    const dat1 = await response1.json();

    for (const article of dat1.articles) {
      const t1 = article.title;
      colnews += t1 + "\n";
    }

    const full_news =
      newsText + "\n" + colnews + "\n" + "This is all the top & trending news for today";

    console.log(full_news);
    textToSpeech(full_news);
  } catch (error) {
    console.error("An error occurred while fetching or processing the news data:", error);
  }
}

// Start the server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
