import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../../constants/api/apiMethods";
import authStrategy from "../../../constants/auth/authStrategy";
import RequestHelper from "../../../helpers/requestHelper";
import SkillsController from "./skillsController";

const skillsController = new SkillsController();
const tags = [API, "skills"];
const skillsRoutes = [];

// Route: Create skills
skillsRoutes.push({
  path: "/createSkills",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    skillsController.createSkill(new RequestHelper(request), handler),
  config: {
    notes: "Create a new skills",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get All skillss
skillsRoutes.push({
  path: "/getAllSkills",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    skillsController.getAllSkills(new RequestHelper(request), handler),
  config: {
    notes: "Get all skills",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default skillsRoutes;
