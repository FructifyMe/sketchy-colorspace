import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Transcribe audio function starting...")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      throw new Error('No audio file provided')
    }

    console.log("Received audio file:", audioFile.name, "type:", audioFile.type, "size:", audioFile.size)

    // Connect to OpenAI's Realtime API
    const ws = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', [
      'realtime',
      `openai-insecure-api-key.${Deno.env.get('OPENAI_API_KEY')}`,
      'openai-beta.realtime-v1',
    ]);

    let transcriptionResult = '';
    let items = [];
    let clientInfo = {};

    ws.onopen = () => {
      console.log("Connected to OpenAI Realtime API");
      
      // Send session configuration
      ws.send(JSON.stringify({
        type: 'session.update',
        session: {
          modalities: ["text", "audio"],
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1"
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          }
        }
      }));

      // Send audio data
      const reader = audioFile.stream().getReader();
      reader.read().then(function processAudio({done, value}) {
        if (done) {
          console.log("Finished sending audio data");
          return;
        }

        ws.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: btoa(String.fromCharCode.apply(null, value))
        }));

        return reader.read().then(processAudio);
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message from OpenAI:", data.type);

      if (data.type === 'response.audio_transcript.delta') {
        transcriptionResult += data.delta;
      }
    };

    // Wait for transcription to complete
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Transcription timeout'));
      }, 30000);

      ws.onclose = () => {
        clearTimeout(timeout);
        resolve(null);
      };
    });

    // Extract information from transcription
    const extractedData = await extractInformationWithGPT(transcriptionResult);
    
    return new Response(
      JSON.stringify({
        text: transcriptionResult,
        ...extractedData
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error("Error processing request:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})

async function extractInformationWithGPT(transcription: string) {
  const prompt = `
    Extract relevant information from this transcription for an estimate.
    Format the response as a JSON object with these fields:
    - description: A clear summary of the work to be done
    - items: Array of items, each with name, quantity (if mentioned), and price (if mentioned)
    - clientInfo: Object with client's name, address, phone, and email if mentioned
    
    Transcription: "${transcription}"
    
    Return only the JSON object, no other text.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`GPT API error: ${await response.text()}`);
    }

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  } catch (error) {
    console.error("Error extracting information with GPT:", error);
    throw error;
  }
}