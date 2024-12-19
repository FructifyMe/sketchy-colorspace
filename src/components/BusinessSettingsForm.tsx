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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-[95%] sm:max-w-none mx-auto">
      <div className="space-y-4 sm:space-y-6">
        <CompanyLogoUpload
          currentLogo={formData.company_logo}
          onLogoUpdate={(url) => handleFieldChange('company_logo', url)}
        />

        <CompanyInfoForm
          formData={formData}
          onChange={handleFieldChange}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
};

export default BusinessSettingsForm;