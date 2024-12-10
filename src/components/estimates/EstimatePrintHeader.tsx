import { BusinessSettings } from "@/types/estimateDetail";
import { formatDate } from "@/lib/utils";

interface EstimatePrintHeaderProps {
  businessSettings: BusinessSettings;
  estimateNumber?: string;
  estimateDate?: string;
}

const EstimatePrintHeader = ({ 
  businessSettings,
  estimateNumber,
  estimateDate 
}: EstimatePrintHeaderProps) => {
  return (
    <div className="hidden print:block mb-8 border-b border-gray-200 pb-6">
      <div className="flex justify-between items-start">
        {/* Company Information */}
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-2">{businessSettings.company_name || 'Company Name'}</h1>
          <div className="text-sm space-y-1 text-gray-600">
            <p>{businessSettings.address}</p>
            <p>{businessSettings.city}, {businessSettings.state} {businessSettings.zip_code}</p>
            <p>{businessSettings.phone}</p>
            <p>{businessSettings.email}</p>
          </div>
        </div>

        {/* Logo and Estimate Details */}
        <div className="flex-1 flex flex-col items-end">
          {businessSettings.company_logo && (
            <img 
              src={businessSettings.company_logo} 
              alt="Company Logo" 
              className="max-h-16 mb-4 print:grayscale"
            />
          )}
          <div className="text-sm text-right">
            <p className="font-semibold mb-1">ESTIMATE</p>
            {estimateNumber && (
              <p className="text-gray-600">Number: {estimateNumber}</p>
            )}
            {estimateDate && (
              <p className="text-gray-600">Date: {formatDate(estimateDate)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatePrintHeader;