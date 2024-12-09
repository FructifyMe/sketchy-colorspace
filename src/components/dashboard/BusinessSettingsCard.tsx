import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BusinessSettingsForm from "@/components/BusinessSettingsForm";

const BusinessSettingsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Settings</CardTitle>
        <CardDescription>
          Manage your company information that will appear on all templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BusinessSettingsForm />
      </CardContent>
    </Card>
  );
};

export default BusinessSettingsCard;