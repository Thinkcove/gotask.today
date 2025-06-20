import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { IKpiTemplate } from "../../domain/model/kpi/kpiModel";
import {
  createKpiTemplate,
  deleteKpiTemplateById,
  getAllKpiTemplates,
  getKpiTemplateById,
  updateKpiTemplate
} from "./templateService";
import { getKpiTemplateByIdFromDb } from "../../domain/interface/kpi/kpiInterface";
import { KpiTemplateMessages } from "../../constants/apiMessages/kpiMessages";

class KpiTemplateController extends BaseController {
  // Create KPI Template
  async createKpiTemplate(
    requestHelper: RequestHelper,
    handler: any,
    restrictedFields: string[] = []
  ) {
    try {
      const templateData = requestHelper.getPayload() as Partial<IKpiTemplate>;

      // Cast to any to allow dynamic delete without TS error
      const templateDataAny = templateData as any;

      // Remove restricted fields from templateData
      restrictedFields.forEach((field) => {
        if (field in templateDataAny) {
          delete templateDataAny[field];
        }
      });

      if (!templateData.title || !templateData.description || !templateData.measurement_criteria) {
        return this.replyError(new Error(KpiTemplateMessages.CREATE.REQUIRED));
      }

      const newTemplate = await createKpiTemplate(templateData);
      if (!newTemplate.success) {
        return this.replyError(new Error(newTemplate.message || KpiTemplateMessages.CREATE.FAILED));
      }

      return this.sendResponse(handler, newTemplate.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get All KPI Templates
  async getAllKpiTemplates(_requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllKpiTemplates();
      if (!result.success) {
        return this.replyError(new Error(result.message || KpiTemplateMessages.FETCH.FAILED_ALL));
      }
      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get KPI Template by template_id
  async getKpiTemplateById(requestHelper: RequestHelper, handler: any) {
    try {
      const template_id = requestHelper.getParam("template_id");
      const result = await getKpiTemplateById(template_id);
      if (!result.success) {
        return this.replyError(new Error(result.message || KpiTemplateMessages.FETCH.FAILED_BY_ID));
      }
      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Update KPI Template
  async updateKpiTemplate(
    requestHelper: RequestHelper,
    handler: any,
    restrictedFields: string[] = []
  ) {
    try {
      const template_id = requestHelper.getParam("template_id");
      const payload = requestHelper.getPayload() as Partial<IKpiTemplate>;

      const payloadAny = payload as any;

      // Remove restricted fields from the payload
      restrictedFields.forEach((field) => {
        if (field in payloadAny) {
          delete payloadAny[field];
        }
      });

      // Fetch current template for validation
      const currentTemplate = await getKpiTemplateByIdFromDb(template_id);
      if (!currentTemplate) {
        return this.replyError(new Error(KpiTemplateMessages.UPDATE.NOT_FOUND));
      }

      const result = await updateKpiTemplate(template_id, payload);
      if (!result.success) {
        return this.replyError(new Error(result.message || KpiTemplateMessages.UPDATE.FAILED));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Delete KPI Template
  async deleteKpiTemplate(requestHelper: RequestHelper, handler: any) {
    try {
      const template_id = requestHelper.getParam("template_id");
      const result = await deleteKpiTemplateById(template_id);
      if (!result.success) {
        return this.replyError(new Error(result.message || KpiTemplateMessages.DELETE.FAILED));
      }
      return this.sendResponse(handler, { message: KpiTemplateMessages.DELETE.SUCCESS });
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default KpiTemplateController;
