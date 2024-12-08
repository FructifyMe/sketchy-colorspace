import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  estimateId: string;
  to: string;
  subject?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Received request to send estimate email')

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    )

    const { estimateId, to, subject } = await req.json() as EmailRequest
    console.log('Processing email request for estimate:', estimateId)

    // Fetch estimate details
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select('*, business_settings!inner(*)')
      .eq('id', estimateId)
      .single()

    if (estimateError) {
      console.error('Error fetching estimate:', estimateError)
      throw new Error('Failed to fetch estimate details')
    }

    // Generate HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">${estimate.business_settings.company_name || 'Estimate'}</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #666;">Estimate Details</h2>
          ${estimate.description ? `<p>${estimate.description}</p>` : ''}
          
          <div style="margin-top: 20px;">
            <h3 style="color: #666;">Items</h3>
            ${estimate.items.map((item: any) => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <div style="display: flex; justify-content: space-between;">
                  <strong>${item.name}</strong>
                  <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div style="color: #666; font-size: 0.9em;">
                  Quantity: ${item.quantity} × $${item.price.toFixed(2)}
                </div>
              </div>
            `).join('')}
            
            <div style="margin-top: 20px; text-align: right;">
              <strong>Total: $${estimate.items.reduce((total: number, item: any) => 
                total + (item.price * item.quantity), 0).toFixed(2)}</strong>
            </div>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin-top: 20px;">
          <div style="color: #666;">
            ${estimate.business_settings.company_name}<br>
            ${estimate.business_settings.email}<br>
            ${estimate.business_settings.phone}<br>
            ${estimate.business_settings.address}, 
            ${estimate.business_settings.city}, 
            ${estimate.business_settings.state} 
            ${estimate.business_settings.zip_code}
          </div>
        </div>
      </div>
    `

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: estimate.business_settings.email,
        to: [to],
        subject: subject || `Estimate from ${estimate.business_settings.company_name}`,
        html: htmlContent,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Error sending email:', error)
      throw new Error('Failed to send email')
    }

    const data = await res.json()
    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-estimate function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

serve(handler)