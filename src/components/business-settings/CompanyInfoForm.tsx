import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyInfoFormProps {
  formData: {
    company_name: string;
    company_header: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
}

const CompanyInfoForm = ({ formData, onChange }: CompanyInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Company Name</Label>
        <Input
          value={formData.company_name}
          onChange={(e) => onChange('company_name', e.target.value)}
          placeholder="Enter company name"
        />
      </div>

      <div className="space-y-2">
        <Label>Company Header</Label>
        <Input
          value={formData.company_header}
          onChange={(e) => onChange('company_header', e.target.value)}
          placeholder="Enter company header"
        />
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Enter street address"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Enter city"
          />
        </div>

        <div className="space-y-2">
          <Label>State</Label>
          <Input
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="Enter state"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label>ZIP Code</Label>
          <Input
            value={formData.zip_code}
            onChange={(e) => onChange('zip_code', e.target.value)}
            placeholder="Enter ZIP code"
          />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="Enter phone number"
            type="tel"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter email address"
          type="email"
        />
      </div>
    </div>
  );
};

export default CompanyInfoForm;