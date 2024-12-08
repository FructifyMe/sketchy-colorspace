import { Button } from "@/components/ui/button";
import TemplateFormFields from "./TemplateFormFields";
import { useTemplateForm } from "@/hooks/useTemplateForm";

interface TemplateFormProps {
  onClose: () => void;
}

const TemplateForm = ({ onClose }: TemplateFormProps) => {
  const { formData, setFormData, isLoading, handleSubmit } = useTemplateForm(onClose);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TemplateFormFields formData={formData} setFormData={setFormData} />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;