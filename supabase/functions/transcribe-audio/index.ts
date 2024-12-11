import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Step 1: Transcribe audio using Whisper
    const whisperFormData = new FormData();
    whisperFormData.append('file', audioFile);
    whisperFormData.append('model', 'whisper-1');
    whisperFormData.append('response_format', 'json');
    whisperFormData.append('language', 'en');

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
      console.error("Whisper API error:", error);
      throw new Error(`Whisper API error: ${error}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcribedText = transcriptionResult.text;
    console.log("Transcription result:", transcribedText);

    // Step 2: Process with GPT-4 using enhanced prompt for better note extraction
    console.log("Step 2: Processing with GPT-4o-mini...");
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
            content: `You are an AI assistant specialized in extracting estimate information from verbal descriptions.
            Your primary focus is to carefully separate the core estimate details from any special instructions, requirements, or notes.
            
            Extract and categorize the information as follows:

            1. Client Information:
               - Name (required)
               - Email (if mentioned)
               - Phone (if mentioned)
               - Address (if mentioned)

            2. Core Estimate Components:
               - Main description: A clear, concise summary of the primary work to be done
               - Line items: Each distinct service or product with quantity and price

            3. Notes and Special Instructions (VERY IMPORTANT):
               Carefully identify and extract ANY of the following:
               - Access instructions (how to enter, where to park, etc.)
               - Special requirements (cleaning shoes, specific timing, etc.)
               - Client preferences (color choices, specific materials, etc.)
               - Safety considerations
               - Environmental considerations
               - Any other instructions or requests that aren't part of the actual work items

            Format the response as a JSON object with this exact structure:
            {
              "clientInfo": {
                "name": "string or null",
                "email": "string or null",
                "phone": "string or null",
                "address": "string or null"
              },
              "description": "string summarizing the main work",
              "items": [
                {
                  "description": "string",
                  "quantity": number,
                  "price": number
                }
              ],
              "notes": "string containing ALL special instructions, requirements, and additional details that aren't part of the work items"
            }

            IMPORTANT: The notes field should capture ANY instructions or requests that aren't directly related to the work items or pricing.
            Examples of what should go in notes:
            - "Please enter through the back door"
            - "Need to complete work before 3pm"
            - "Must wear shoe covers"
            - "Call before arriving"
            These are crucial details that need to be captured separately from the work description.` // eslint-disable-line max-len
          },
          {
            role: "user",
            content: transcribedText
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!extractionResponse.ok) {
      const error = await extractionResponse.text();
      console.error("GPT-4 API error:", error);
      throw new Error(`GPT-4 API error: ${error}`);
    }

    const extractionResult = await extractionResponse.json();
    console.log("GPT-4o-mini response:", extractionResult);

    let structuredData;
    try {
      structuredData = JSON.parse(extractionResult.choices[0].message.content);
      console.log("Parsed structured data:", structuredData);
    } catch (error) {
      console.error("Error parsing GPT response:", error);
      throw new Error("Failed to parse structured data from GPT response");
    }

    return new Response(
      JSON.stringify(structuredData),  // Only return the processed data
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error("Error in transcribe-audio function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});