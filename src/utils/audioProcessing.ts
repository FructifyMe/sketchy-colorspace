import { pipeline } from '@huggingface/transformers';
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
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  const audioArrayBuffer = await audioBlob.arrayBuffer();
  const audioArray = new Float32Array(audioArrayBuffer);

  try {
    console.log("Initializing transcriber pipeline...");
    
    // Call Supabase Edge Function to get the API key
    const { data, error } = await supabase.functions.invoke('get-huggingface-key');
    if (error) throw new Error('Failed to get API key');

    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "onnx-community/whisper-tiny.en",
      { 
        device: "cpu" as const,
        accessToken: data.apiKey
      }
    );

    console.log("Transcribing audio...");
    const transcription = await transcriber(audioArray);
    const transcriptionText = typeof transcription === 'string' 
      ? transcription 
      : Array.isArray(transcription) 
        ? transcription[0]?.text || ''
        : transcription.text || '';

    console.log("Transcription completed:", transcriptionText);

    return {
      transcriptionText,
      items: extractItemsFromText(transcriptionText)
    };
  } catch (error) {
    console.error("Error in audio processing:", error);
    throw error;
  }
};