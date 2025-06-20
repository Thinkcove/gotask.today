import BaseController from "../../../common/baseController";
import RequestHelper from "../../../helpers/requestHelper";
import { SkillService } from "./skillsService";

class SkillsController extends BaseController {
  async createSkill(requestHelper: RequestHelper, handler: any) {
    try {
      const { name } = requestHelper.getPayload();
      if (!name) throw new Error("Skill name is required");

      const result = await SkillService.createSkill(name);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getAllSkills(_: any, handler: any) {
    try {
      const result = await SkillService.getAllSkills();
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default SkillsController;
