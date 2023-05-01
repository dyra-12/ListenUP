// Import required modules
const { AudioConfig, SpeechConfig, SpeechRecognizer } = require('microsoft-cognitiveservices-speech-sdk');

// Replace with your own Azure Cognitive Services subscription key and region
const subscriptionKey = "a78237149a864882b0c75466fab83131";
const region = 'eastus';

// Create an instance of SpeechConfig with your subscription key and region
const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);

// Create an instance of AudioConfig with the default microphone input
const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

// Create an instance of SpeechRecognizer with the SpeechConfig and AudioConfig
const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

// Set up event handlers for recognition events
recognizer.recognizing = (sender, event) => {
  console.log(`RECOGNIZING: Text=${event.result.text}`);
};

recognizer.recognized = (sender, event) => {
  console.log(`RECOGNIZED: Text=${event.result.text}`);
};

recognizer.canceled = (sender, event) => {
  console.log(`CANCELED: Reason=${event.reason}`);
};

recognizer.sessionStopped = (sender, event) => {
  console.log('Session stopped');
};

// Start speech recognition
recognizer.startContinuousRecognitionAsync();

// Stop speech recognition after a duration of time (in seconds)
const recognitionDuration = 5; // Replace with your desired recognition duration in seconds
setTimeout(() => {
  console.log(`Recognition completed after ${recognitionDuration} seconds`);
  recognizer.stopContinuousRecognitionAsync();
}, recognitionDuration * 1000);

