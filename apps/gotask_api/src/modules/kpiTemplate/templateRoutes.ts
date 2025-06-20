import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import authStrategy from "../../constants/auth/authStrategy";
import KpiTemplateController from "./templateController";

const kpiTemplateController = new KpiTemplateController();
const tags = [API, "KpiTemplate"];
const KpiTemplateRoutes = [];

// Route: Create KPI Template
KpiTemplateRoutes.push({
  path: "/kpi/template",
  method: API_METHODS.POST,
  handler: (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
    kpiTemplateController.createKpiTemplate(new RequestHelper(request), h, restrictedFields),
  config: {
    notes: "Create a new KPI template",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get All KPI Templates
KpiTemplateRoutes.push({
  path: "/kpi/templates",
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiTemplateController.getAllKpiTemplates(new RequestHelper(request), h),
  config: {
    notes: "Get all KPI templates",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get KPI Template by template_id
KpiTemplateRoutes.push({
  path: "/kpi/templates/{template_id}",
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiTemplateController.getKpiTemplateById(new RequestHelper(request), h),
  config: {
    notes: "Get KPI template by template_id",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Update KPI Template
KpiTemplateRoutes.push({
  path: "/kpi/templates/{template_id}",
  method: API_METHODS.PUT,
  handler: (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
    kpiTemplateController.updateKpiTemplate(new RequestHelper(request), h, restrictedFields),
  config: {
    notes: "Update KPI template by template_id",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Delete KPI Template
KpiTemplateRoutes.push({
  path: "/kpi/templates/{template_id}",
  method: API_METHODS.DELETE,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiTemplateController.deleteKpiTemplate(new RequestHelper(request), h),
  config: {
    notes: "Delete KPI template by template_id",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default KpiTemplateRoutes;
