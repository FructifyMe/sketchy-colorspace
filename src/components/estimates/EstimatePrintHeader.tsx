import { BusinessSettings } from "@/types/estimateDetail";

interface EstimatePrintHeaderProps {
  businessSettings: BusinessSettings;
}

const EstimatePrintHeader = ({ businessSettings }: EstimatePrintHeaderProps) => {
  return (
    <div className="mb-8 flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold mb-2">{businessSettings.company_name || 'Company Name'}</h1>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{businessSettings.address}</p>
          <p>{businessSettings.city}, {businessSettings.state} {businessSettings.zip_code}</p>
          <p>{businessSettings.phone}</p>
          <p>{businessSettings.email}</p>
        </div>
      </div>
      {businessSettings.company_logo && (
        <img 
          src={businessSettings.company_logo} 
          alt="Company Logo" 
          className="h-16 w-auto object-contain"
        />
      )}
    </div>
  );
};

export default EstimatePrintHeader;