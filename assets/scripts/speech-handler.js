window.SpeechHandler = class SpeechHandler {
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.setupRecognition();
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.silenceTimeout = 6000; // Default 6 seconds
    this.onInterimCallback = null;
    this.onFinalCallback = null;

    // Get settings from storage
    chrome.storage.sync.get(['silenceTimeout'], (data) => {
      if (data.silenceTimeout) {
        this.silenceTimeout = data.silenceTimeout * 1000;
      }
    });
  }

  setupRecognition() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript && typeof this.onInterimCallback === 'function') {
        this.onInterimCallback(interimTranscript);
      }
      if (finalTranscript && typeof this.onFinalCallback === 'function') {
        this.onFinalCallback(finalTranscript);
      }
    };
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Send message to background script to handle download
        chrome.runtime.sendMessage({
          action: 'downloadAudio',
          url: url,
          filename: `voice-recording-${timestamp}.webm`
        });
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  start(onInterim, onFinal) {
    this.onInterimCallback = onInterim;
    this.onFinalCallback = onFinal;
    this.recognition.start();
  }

  stop() {
    this.recognition.stop();
    this.stopRecording();
    this.onInterimCallback = null;
    this.onFinalCallback = null;
  }
};