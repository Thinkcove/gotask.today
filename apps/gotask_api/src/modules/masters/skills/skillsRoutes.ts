import { Request, ResponseToolkit } from "@hapi/hapi";
import SkillsController from "./skillsController";
import { API_METHODS } from "../../../constants/api/apiMethods";
import RequestHelper from "../../../helpers/requestHelper";
import authStrategy from "../../../constants/auth/authStrategy";

const skillsController = new SkillsController();
const tags = [API, "Skills"];
const SkillRoutes = [];

SkillRoutes.push(
    {
      path: `/createSkills`,
      method: API_METHODS.POST,
      handler: (request: Request, handler: ResponseToolkit) =>
        skillsController.createSkill(new RequestHelper(request), handler),
      config: {
        notes: "Create a master skill",
        tags,
        auth: {
          strategy: authStrategy.SIMPLE
        }
      }
    }),

export default SkillRoutes;
