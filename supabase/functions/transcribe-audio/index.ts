import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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

    console.log("Received audio file, size:", audioFile.size)

    // Convert the audio file to a buffer
    const audioBuffer = await audioFile.arrayBuffer()

    // Create FormData for OpenAI API
    const openAiFormData = new FormData()
    openAiFormData.append('file', new Blob([audioBuffer]), 'audio.wav')
    openAiFormData.append('model', 'whisper-1')
    openAiFormData.append('language', 'en')

    console.log("Sending request to OpenAI...")

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

    // Extract items from the transcription
    const text = result.text
    const items = extractItemsFromText(text)

    return new Response(
      JSON.stringify({
        transcriptionText: text,
        items: items
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

function extractItemsFromText(text: string) {
  const items = []
  const lines = text.split('.')
  
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
}