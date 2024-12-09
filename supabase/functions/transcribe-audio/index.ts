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

    // Step 2: Process with GPT-4 using enhanced prompt for better email extraction
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
            Your primary focus is to carefully extract and validate contact information, especially email addresses.
            
            When processing email addresses:
            1. Always include the @ symbol
            2. Ensure there's a valid domain extension (e.g., .com, .net, .org)
            3. Remove any spaces or invalid characters
            4. If an email is mentioned like "dave at microsoft dot com", convert it to proper format "dave@microsoft.com"
            5. If the email format is unclear or invalid, leave it as null rather than guessing
            
            Extract and categorize the information as follows:

            1. Client Information:
               - Name (required)
               - Email (must be properly formatted with @ and domain, or null if invalid)
               - Phone (if mentioned)
               - Address (if mentioned)

            2. Core Estimate Components:
               - Main description: A clear, concise summary of the primary work to be done
               - Line items: Each distinct service or product with quantity and price

            3. Notes and Special Instructions:
               - Access instructions
               - Special requirements
               - Client preferences
               - Safety considerations
               - Environmental considerations
               - Any other relevant instructions

            Format the response as a JSON object with this exact structure:
            {
              "clientInfo": {
                "name": "string or null",
                "email": "properly formatted email or null",
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
              "notes": "string containing ALL special instructions and additional details"
            }

            Example of proper email handling:
            - Input: "dave at msn dot com" -> Output: "dave@msn.com"
            - Input: "davebatmsn.com" -> Output: null (invalid format)
            - Input: "dave@msn" -> Output: null (incomplete domain)
            `
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
      
      // Additional validation for email format
      if (structuredData.clientInfo?.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(structuredData.clientInfo.email)) {
          console.log("Invalid email format detected, setting to null:", structuredData.clientInfo.email);
          structuredData.clientInfo.email = null;
        }
      }
      
    } catch (error) {
      console.error("Error parsing GPT response:", error);
      throw new Error("Failed to parse structured data from GPT response");
    }

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