import { supabase } from '@/integrations/supabase/client';

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new AudioContext({
      sampleRate: 24000 // Required by OpenAI
    });
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData.buffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }
}

const audioQueue = new AudioQueue();

export const processAudioData = async (audioChunks: Blob[]) => {
  console.log("Starting audio processing with chunks:", audioChunks.length);
  
  if (audioChunks.length === 0) {
    throw new Error("No audio data recorded");
  }

  try {
    // Create FormData with the audio file
    const formData = new FormData();
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    formData.append('audio', audioBlob, 'recording.webm');
    
    console.log("Sending audio to transcription service...");
    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: formData,
    });

    if (error) {
      console.error("Transcription error:", error);
      throw error;
    }

    console.log("Transcription completed:", data);
    return {
      transcriptionText: data.text || '',
      items: data.items || [],
      clientInfo: data.clientInfo || {}
    };
  } catch (error) {
    console.error("Error in audio processing:", error);
    throw error;
  }
};