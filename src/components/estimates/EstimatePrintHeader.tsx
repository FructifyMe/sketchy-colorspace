import { BusinessSettings } from "@/types/estimateDetail";
import { formatDate } from "@/lib/utils";
import { format } from 'date-fns';

interface EstimatePrintHeaderProps {
  businessSettings?: BusinessSettings;
  estimateNumber: string;
  estimateDate: string;
}

const EstimatePrintHeader = ({ 
  businessSettings,
  estimateNumber,
  estimateDate 
}: EstimatePrintHeaderProps) => {
  return (
    <div className="hidden print:block mb-8 border-b border-gray-200 pb-6">
      <div className="flex justify-between">
        {/* Company Information */}
        <div className="w-1/2">
          <h1 className="text-base font-bold mb-1">
            {businessSettings?.company_name || 'Company Name'}
          </h1>
          {businessSettings?.company_header && (
            <p className="text-sm text-gray-600 mb-2">{businessSettings.company_header}</p>
          )}
          <div className="text-xs space-y-0.5 text-gray-600">
            {businessSettings?.address && <p>{businessSettings.address}</p>}
            {(businessSettings?.city || businessSettings?.state || businessSettings?.zip_code) && (
              <p>
                {businessSettings.city}
                {businessSettings.city && businessSettings.state && ', '}
                {businessSettings.state} {businessSettings.zip_code}
              </p>
            )}
            {businessSettings?.phone && <p>{businessSettings.phone}</p>}
            {businessSettings?.email && <p>{businessSettings.email}</p>}
          </div>
        </div>

        {/* Logo and Estimate Details */}
        <div className="w-1/2 text-right">
          {businessSettings?.company_logo && (
            <img 
              src={businessSettings.company_logo} 
              alt="Company Logo" 
              className="max-h-14 mb-4 print:grayscale ml-auto"
            />
          )}
          <div className="text-xs">
            <p className="font-semibold mb-1">ESTIMATE</p>
            <p className="text-gray-600">Number: {estimateNumber}</p>
            <p className="text-gray-600">Date: {format(new Date(estimateDate), 'MM/dd/yyyy')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatePrintHeader;