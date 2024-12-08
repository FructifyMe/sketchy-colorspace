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

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('Transcription timeout'));
      }, 30000); // 30 second timeout

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

      ws.onclose = () => {
        clearTimeout(timeout);
        console.log("WebSocket closed, final transcription:", transcriptionResult);
        
        // Extract information from transcription
        const extractedData = {
          text: transcriptionResult,
          items: items,
          clientInfo: clientInfo
        };
        
        resolve(new Response(
          JSON.stringify(extractedData),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          },
        ));
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        clearTimeout(timeout);
        reject(error);
      };
    }).catch(error => {
      console.error("Error in transcription:", error);
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
    });
  } catch (error) {
    console.error("Error processing request:", error);
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