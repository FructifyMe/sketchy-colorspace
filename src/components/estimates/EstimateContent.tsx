import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EstimatePrintHeader from './EstimatePrintHeader';
import EstimateClientInfo from './EstimateClientInfo';
import EstimateItemsSection from './EstimateItemsSection';
import EstimateAdditionalDetails from './EstimateAdditionalDetails';
import type { Estimate } from '@/types/estimateDetail';

interface EstimateContentProps {
  estimate: Estimate;
  showNotes?: boolean;
  mode?: 'print' | 'email';
}

export const EstimateContent = ({ estimate, showNotes = true, mode = 'print' }: EstimateContentProps) => {
  const containerClass = mode === 'email' 
    ? "font-sans max-w-[600px] mx-auto space-y-4" 
    : "space-y-2 print:space-y-1 [&_*]:print:!text-[0.8em]";

  const cardClass = mode === 'email'
    ? "border border-gray-200 rounded-lg overflow-hidden"
    : "print:shadow-none print:border-none";

  return (
    <div className={containerClass}>
      <EstimatePrintHeader 
        businessSettings={estimate.business_settings}
        estimateNumber={estimate.id}
        estimateDate={estimate.created_at}
      />

      <div className="flex gap-8 print:gap-4">
        <div className="w-1/3">
          <EstimateClientInfo 
            clientInfo={estimate.client_info} 
            estimateDate={estimate.created_at}
          />
        </div>

        <div className="flex-1 space-y-4 print:space-y-2">
          <h2 className="text-xl font-semibold mb-2 text-left print:text-sm print:mb-1">Estimate</h2>

          <Card className={cardClass}>
            <CardHeader className="py-2 print:py-1">
              <CardTitle className="text-left text-base print:text-xs">Description</CardTitle>
            </CardHeader>
            <CardContent className="py-2 print:py-1">
              <div className="text-left whitespace-pre-wrap text-sm print:text-xs">
                {estimate.description?.split('\n').map((line, index) => (
                  line.trim() && (
                    <div key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{line.trim()}</span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>

          <EstimateItemsSection
            items={estimate.items}
            isEditing={false}
          />

          {showNotes && estimate.notes && (
            <Card className={`${cardClass} print:mt-2`}>
              <CardHeader className="py-1">
                <CardTitle className="text-xs font-semibold">Notes</CardTitle>
              </CardHeader>
              <CardContent className="py-1">
                <div className="whitespace-pre-wrap text-xs">
                  {estimate.notes}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showNotes && (
        <EstimateAdditionalDetails
          terms={estimate.terms_and_conditions}
          paymentPolicy={estimate.payment_policy}
          notes={estimate.notes}
          showTerms={estimate.show_terms}
          showPaymentPolicy={estimate.show_payment_policy}
          isEditing={false}
          onUpdate={() => {}}
        />
      )}
    </div>
  );
};

export const getEstimateHtml = (estimate: Estimate): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.4; 
            color: #333;
            font-size: 14px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 16px;
          }
          .card { 
            border: 1px solid #e2e8f0; 
            border-radius: 8px; 
            margin-bottom: 16px;
          }
          .card-header { 
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
          }
          .card-content { 
            padding: 12px 16px;
          }
          h1 { font-size: 1.5rem; margin: 0 0 8px 0; }
          h2 { font-size: 1.25rem; margin: 0 0 8px 0; }
          h3 { font-size: 1.1rem; margin: 0; }
          p { margin: 0 0 8px 0; }
          .text-left { text-align: left; }
          .whitespace-pre-wrap { white-space: pre-wrap; }
          .business-header {
            text-align: center;
            margin-bottom: 16px;
          }
          .business-header p {
            font-size: 0.9rem;
            margin: 0;
          }
          .estimate-info {
            margin-bottom: 16px;
          }
          .items-list {
            margin-bottom: 8px;
          }
          .item {
            margin-bottom: 8px;
          }
          .total {
            text-align: right;
            font-weight: bold;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${estimate.business_settings?.business_name ? `
            <div class="business-header">
              <h1>${estimate.business_settings.business_name}</h1>
              ${estimate.business_settings.business_address ? `<p>${estimate.business_settings.business_address}</p>` : ''}
            </div>
          ` : ''}
          
          <div class="estimate-info">
            <h2>Estimate #${estimate.id}</h2>
            <p><strong>Date:</strong> ${new Date(estimate.created_at).toLocaleDateString()}</p>
            ${estimate.client_info?.name ? `<p><strong>Client:</strong> ${estimate.client_info.name}</p>` : ''}
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Description</h3>
            </div>
            <div class="card-content">
              <div class="text-left whitespace-pre-wrap">
                ${estimate.description || 'No description provided'}
              </div>
            </div>
          </div>

          ${estimate.items?.length ? `
            <div class="card">
              <div class="card-header">
                <h3>Items</h3>
              </div>
              <div class="card-content">
                <div class="items-list">
                  ${estimate.items.map((item: any) => `
                    <div class="item">
                      <strong>${item.description}</strong><br>
                      ${item.quantity} x $${item.price} = $${item.quantity * item.price}
                    </div>
                  `).join('')}
                </div>
                <div class="total">
                  Total: $${estimate.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0)}
                </div>
              </div>
            </div>
          ` : ''}

          ${estimate.notes ? `
            <div class="card">
              <div class="card-header">
                <h3>Notes</h3>
              </div>
              <div class="card-content">
                ${estimate.notes}
              </div>
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
};

export default EstimateContent;
