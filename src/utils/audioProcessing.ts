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
  const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
  const audioArrayBuffer = await audioBlob.arrayBuffer();
  const audioArray = new Float32Array(audioArrayBuffer);

  const transcriber = await pipeline(
    "automatic-speech-recognition",
    "openai/whisper-small"
  );

  const transcription = await transcriber(audioArray);
  const transcriptionText = Array.isArray(transcription) 
    ? transcription[0]?.text || ''
    : transcription.text || '';

  console.log("Transcription:", transcriptionText);

  return {
    transcriptionText,
    items: extractItemsFromText(transcriptionText)
  };
};