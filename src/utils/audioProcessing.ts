import { pipeline } from '@huggingface/transformers';

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
    const transcriber = await pipeline(
      "automatic-speech-recognition",
      "onnx-community/whisper-tiny.en",
      { device: "cpu" } // Using CPU as fallback since WebGPU might not be available
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