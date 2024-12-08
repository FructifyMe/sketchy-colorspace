import { Button } from "@/components/ui/button";
import CompanyLogoUpload from "./business-settings/CompanyLogoUpload";
import CompanyInfoForm from "./business-settings/CompanyInfoForm";
import { useBusinessSettings } from "./business-settings/useBusinessSettings";

const BusinessSettingsForm = () => {
  const {
    formData,
    isLoading,
    isLoadingSettings,
    handleSubmit,
    handleFieldChange,
  } = useBusinessSettings();

  if (isLoadingSettings) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CompanyLogoUpload
        currentLogo={formData.company_logo}
        onLogoUpdate={(url) => handleFieldChange('company_logo', url)}
      />

      <CompanyInfoForm
        formData={formData}
        onChange={handleFieldChange}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
};

export default BusinessSettingsForm;