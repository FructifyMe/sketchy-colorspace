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

    // Step 2: Process with GPT-4 using enhanced prompt for templateless approach
    console.log("Step 2: Processing with GPT-4...");
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
            content: `You are an AI assistant specialized in creating detailed estimates from verbal descriptions. 
            Analyze the input and create a comprehensive estimate with the following structure:

            1. Project Overview:
               - Extract a clear, detailed description of the work
               - Identify and categorize the type of work (e.g., Construction, Landscaping, Design, etc.)
               - Note any specific requirements, conditions, or constraints
               - Identify any permits or licenses needed

            2. Client Information:
               - Name (required if mentioned)
               - Contact details (address, phone, email if provided)
               - Any specific client preferences or requirements
               - Format email addresses properly (convert spoken "at" to "@")
               - Any relevant property details

            3. Line Items (break down into logical categories):
               For each item identify:
               - Category (group similar items)
               - Description (be specific and detailed)
               - Quantity (with units)
               - Unit price (if mentioned)
               - Labor costs (separate from materials)
               - Any specific requirements or notes
               
            4. Timeline and Scheduling:
               - Start date (if mentioned)
               - Duration estimates
               - Key milestones or phases
               - Any scheduling constraints
               - Season-specific considerations

            5. Additional Considerations:
               - Required materials
               - Equipment needed
               - Safety requirements
               - Warranty information
               - Maintenance recommendations

            Return a JSON object with this exact structure:
            {
              "description": "Comprehensive project description",
              "projectType": "Category of work",
              "items": [
                {
                  "category": "Logical grouping",
                  "name": "Item description",
                  "quantity": number,
                  "price": number,
                  "isLabor": boolean,
                  "notes": "Additional details"
                }
              ],
              "clientInfo": {
                "name": "string",
                "address": "string",
                "phone": "string",
                "email": "string",
                "propertyDetails": "string"
              },
              "timeline": {
                "startDate": "string",
                "duration": "string",
                "milestones": ["string"],
                "constraints": "string"
              },
              "additionalDetails": {
                "materials": ["string"],
                "equipment": ["string"],
                "safety": ["string"],
                "warranty": "string",
                "maintenance": "string"
              }
            }`
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
    console.log("GPT-4 response:", extractionResult);

    let structuredData;
    try {
      structuredData = JSON.parse(extractionResult.choices[0].message.content);
      console.log("Parsed structured data:", structuredData);
    } catch (error) {
      console.error("Error parsing GPT response:", error);
      throw new Error("Failed to parse structured data from GPT response");
    }

    return new Response(
      JSON.stringify({
        transcriptionText: transcribedText,
        description: structuredData.description,
        projectType: structuredData.projectType,
        items: structuredData.items,
        clientInfo: structuredData.clientInfo,
        timeline: structuredData.timeline,
        additionalDetails: structuredData.additionalDetails
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