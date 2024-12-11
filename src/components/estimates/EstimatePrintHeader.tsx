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
    <div className="hidden print:block mb-8 border-b border-gray-200 pb-6 print:mb-2 print:pb-2">
      <div className="flex justify-between print:gap-4">
        {/* Company Information */}
        <div className="text-left">
          <h1 className="text-2xl font-bold print:text-xl mb-2 print:mb-0.5">
            {businessSettings?.company_name || 'Company Name'}
          </h1>
          {businessSettings?.company_header && (
            <p className="text-lg text-gray-600 mb-2 print:text-sm print:mb-0.5">{businessSettings.company_header}</p>
          )}
          <div className="text-base space-y-1 text-gray-600 print:text-sm print:space-y-0">
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

        {/* Logo and Date Only */}
        <div className="text-right">
          {businessSettings?.company_logo && (
            <img 
              src={businessSettings.company_logo} 
              alt="Company Logo" 
              className="max-h-32 mb-4 print:grayscale ml-auto print:max-h-24 print:mb-1" 
            />
          )}
          <div className="text-base print:text-sm">
            <p className="text-gray-600">Date: {format(new Date(estimateDate), 'MM/dd/yyyy')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatePrintHeader;