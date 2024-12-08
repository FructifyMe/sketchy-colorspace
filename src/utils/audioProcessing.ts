import { supabase } from '@/integrations/supabase/client';

export const extractItemsFromText = (text: string) => {
  const items = [];
  const lines = text.split('.');
  
  for (const line of lines) {
    const priceMatch = line.match(/\$(\d+(\.\d{2})?)/);
    const quantityMatch = line.match(/(\d+)\s*(pieces?|units?|items?)/i);
    
    if (priceMatch || quantityMatch) {
      items.push({
        name: line.trim(),
        price: priceMatch ? parseFloat(priceMatch[1]) : undefined,
        quantity: quantityMatch ? parseInt(quantityMatch[1]) : undefined,
      });
    }
  }
  
  return items;
};

export const processAudioData = async (audioChunks: Blob[]) => {
  console.log("Starting audio processing...");
  
  // Create a blob with explicit MIME type
  const mimeType = audioChunks[0].type || 'audio/mp3';
  const audioBlob = new Blob(audioChunks, { type: mimeType });
  console.log("Audio blob created with type:", mimeType);

  try {
    // Create FormData with the audio file
    const formData = new FormData();
    formData.append('audio', audioBlob, `recording.${mimeType.split('/')[1]}`);
    
    console.log("Sending audio to transcription service...");
    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: formData,
    });

    if (error) {
      console.error("Transcription error:", error);
      throw error;
    }

    console.log("Transcription completed:", data);
    const transcriptionText = data.text;

    return {
      transcriptionText,
      items: extractItemsFromText(transcriptionText)
    };
  } catch (error) {
    console.error("Error in audio processing:", error);
    throw error;
  }
};