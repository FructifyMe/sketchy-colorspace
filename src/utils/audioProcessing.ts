import { supabase } from '@/integrations/supabase/client';

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

    console.log("Transcription and extraction completed:", data);
    return {
      transcriptionText: data.transcriptionText || '',
      items: data.items || [],
      clientInfo: data.clientInfo || {}
    };
  } catch (error) {
    console.error("Error in audio processing:", error);
    throw error;
  }
};