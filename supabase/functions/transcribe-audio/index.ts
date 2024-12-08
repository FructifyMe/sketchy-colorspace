import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Transcribe audio function starting...")

interface ExtractedData {
  description: string;
  items: Array<{
    name: string;
    quantity?: number;
    price?: number;
  }>;
  clientInfo?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

async function extractInformationWithGPT(transcription: string): Promise<ExtractedData> {
  console.log("Extracting information from transcription:", transcription);

  const prompt = `
    Extract relevant information from this transcription for an estimate or invoice.
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
        model: "gpt-3.5-turbo",
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
    const parsedData = JSON.parse(result.choices[0].message.content);
    console.log("Extracted data:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error extracting information with GPT:", error);
    throw error;
  }
}

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

    // Create FormData for OpenAI API
    const openAiFormData = new FormData()
    openAiFormData.append('file', audioFile)
    openAiFormData.append('model', 'whisper-1')
    openAiFormData.append('language', 'en')

    console.log("Sending request to OpenAI Whisper...")

    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: openAiFormData,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error}`)
    }

    const result = await response.json()
    console.log("Transcription successful:", result)

    // Extract structured information using GPT
    const extractedData = await extractInformationWithGPT(result.text);

    return new Response(
      JSON.stringify({
        transcriptionText: result.text,
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