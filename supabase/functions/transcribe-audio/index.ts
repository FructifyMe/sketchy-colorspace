import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    console.log("Received audio file:", audioFile.name, "type:", audioFile.type, "size:", audioFile.size);

    // Create a new FormData for the Whisper API
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioFile);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('response_format', 'json');
    whisperFormData.append('language', 'en');

    // Step 1: Transcribe audio to text using Whisper
    console.log("Step 1: Transcribing audio with Whisper...");
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: whisperFormData
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text();
      console.error("Transcription failed:", error);
      throw new Error(`Transcription failed: ${error}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcribedText = transcriptionResult.text;
    console.log("Transcription result:", transcribedText);

    // Step 2: Extract structured data using GPT-4
    console.log("Step 2: Extracting structured data with GPT-4...");
    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Extract structured data from the transcribed text. Return a JSON object with:
              - description: A summary of the work to be done
              - items: Array of items with name, quantity (if mentioned), and price (if mentioned)
              - clientInfo: Object with name, address, phone, and email if mentioned
              
              Only include fields that are actually mentioned in the text.`
          },
          {
            role: "user",
            content: transcribedText
          }
        ]
      })
    });

    if (!extractionResponse.ok) {
      const error = await extractionResponse.text();
      console.error("Extraction failed:", error);
      throw new Error(`Extraction failed: ${error}`);
    }

    const extractionResult = await extractionResponse.json();
    const structuredData = JSON.parse(extractionResult.choices[0].message.content);
    console.log("Extracted structured data:", structuredData);

    // Return both the transcription and structured data
    return new Response(
      JSON.stringify({
        transcriptionText: transcribedText,
        ...structuredData
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );

  } catch (error) {
    console.error("Error in transcribe-audio function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});