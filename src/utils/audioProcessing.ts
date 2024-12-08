import { supabase } from '@/integrations/supabase/client';

export const extractItemsFromText = (text: string) => {
  if (!text) return [];
  
  const items = [];
  const lines = text.split('.');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
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
  
  if (audioChunks.length === 0) {
    throw new Error("No audio data recorded");
  }

  // Get the MIME type from the first chunk
  const mimeType = audioChunks[0].type;
  console.log("Processing audio with MIME type:", mimeType);

  // Create a blob with the original MIME type
  const audioBlob = new Blob(audioChunks, { type: mimeType });
  console.log("Audio blob created, size:", audioBlob.size);

  try {
    // Create FormData with the audio file
    const formData = new FormData();
    // Use a generic extension that OpenAI accepts
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
    const transcriptionText = data.text || '';

    const items = extractItemsFromText(transcriptionText);
    console.log("Extracted items:", items);

    return {
      transcriptionText,
      items
    };
  } catch (error) {
    console.error("Error in audio processing:", error);
    throw error;
  }
};