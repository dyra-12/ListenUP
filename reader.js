const path = require("path");
const express = require("express");
const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const player = require("play-sound")();
const app = express();

//static files are served
app.use(express.static(path.join(__dirname, "public")));

// Set up Azure Cognitive Services Text to Speech
const speechKey = "a78237149a864882b0c75466fab83131";
const serviceRegion = "eastus";
const speechConfig = sdk.SpeechConfig.fromSubscription(
  speechKey,
  serviceRegion
);
const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

// Endpoint to trigger speech synthesis
app.get("/", (req, res) => {
  //readNews();
  res.sendFile(path.join(__dirname, "public", "index.html")); // Send the HTML file as response
});

const api_url =
  "https://newsapi.org/v2/top-headlines?country=in&apiKey=1116921095d64299b278259fee0c0cca";
const news_url =
  "https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=in&apikey=7e5819fe78caf89ae45180c790366be3";

//let title;

function textToSpeech(text) {
  synthesizer.speakTextAsync(
    `${text}`,
    (result) => {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        // Convert ArrayBuffer to Buffer
        const audioData = Buffer.from(result.audioData);

        // Save speech output to a file
        const speechOutputFile = "news_article.wav"; // Output file name
        fs.writeFileSync(speechOutputFile, audioData);

        // Play speech output
        player.play(speechOutputFile, (err) => {
          if (err) {
            console.error(`Error playing speech output: ${err}`);
          }
        });
      }
    },
    (error) => {
      console.error(`Speech synthesis error: ${error}`);
    }
  );
}
async function readNews() {
  const response = await fetch(api_url);
  const dat = await response.json();

  let newsText =
    "Welcome to Listen up: Empowering the Visually Impaired with an Accessible News Reader."+ "\n" + " These are the top Headlines of today." + "\n";
  for (let i = 0; i < 10; i++) {
    const title = dat.articles[i].title;
    const content = dat.articles[i].description;
    newsText = newsText + "Title: " + title + "\n" + content + "\n";
  }

  let colnews = "The other trending news of today are" + "\n";
  const response1 = await fetch(news_url);
  const dat1 = await response1.json();

  for (let i = 0; i < 5; i++) {
    const t1 = dat1.articles[i].title;
    colnews = colnews + t1 +  "\n";
  }

let full_news = newsText+ "\n" + colnews + "\n" + 'This is all the top & trending news for today'

  console.log(full_news);
  textToSpeech(full_news);
}

readNews();

// Start the server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
