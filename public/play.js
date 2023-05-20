function startAudio() {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = new Audio('tts.wav');
    var audioSource = audioContext.createMediaElementSource(audioElement);

    audioSource.connect(audioContext.destination);
    audioElement.play();
  }