import { KPI_FREQUENCY } from "../../../constants/kpiConstants";
import { IKpiTemplate, KpiTemplate } from "../../model/kpi/kpiModel";

// Create a new KPI template
export const createKpiTemplateInDb = async (
  templateData: Partial<IKpiTemplate>
): Promise<IKpiTemplate> => {
  const newTemplate = new KpiTemplate({
    title: templateData.title,
    description: templateData.description,
    measurement_criteria: templateData.measurement_criteria,
    frequency: templateData.frequency || KPI_FREQUENCY.QUARTERLY,
    isActive: templateData.isActive ?? true
  });

  return await newTemplate.save();
};

// Get all KPI templates
export const getAllKpiTemplatesFromDb = async (): Promise<IKpiTemplate[]> => {
  return await KpiTemplate.find().select("-_id -id -__v");
};

// Get KPI template by template_id
export const getKpiTemplateByIdFromDb = async (
  template_id: string
): Promise<IKpiTemplate | null> => {
  return await KpiTemplate.findOne({ template_id }).select("-_id -id -__v");
};

// Update KPI template by template_id
export const updateKpiTemplateInDb = async (
  template_id: string,
  updateData: Partial<IKpiTemplate>,
  changedBy: string = "system"
): Promise<IKpiTemplate | null> => {
  const currentTemplate = await KpiTemplate.findOne({ template_id }).select("-_id -id -__v");
  if (!currentTemplate) return null;

  const changes: Record<string, any> = {};
  for (const key in updateData) {
    if (
      key !== "template_id" &&
      key !== "changeHistory" &&
      updateData[key as keyof IKpiTemplate] !== undefined
    ) {
      changes[key] = {
        oldValue: currentTemplate[key as keyof IKpiTemplate],
        newValue: updateData[key as keyof IKpiTemplate]
      };
    }
  }

  if (Object.keys(changes).length > 0) {
    updateData.changeHistory = [
      ...(currentTemplate.changeHistory || []),
      {
        changedBy: changedBy,
        changedAt: new Date(),
        changes
      }
    ];
  }

  return await KpiTemplate.findOneAndUpdate({ template_id }, updateData, {
    new: true,
    runValidators: true
  }).select("-_id -id -__v");
};

// Delete KPI template by template_id
export const deleteKpiTemplateByIdFromDb = async (template_id: string): Promise<boolean> => {
  const deletedTemplate = await KpiTemplate.findOneAndDelete({ template_id });
  return deletedTemplate !== null;
};
