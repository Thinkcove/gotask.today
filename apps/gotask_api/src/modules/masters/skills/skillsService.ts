import { SkillMaster } from "../../../domain/interface/master/skills/skillsMaster";

export class SkillService {
  static async createSkill(name: string) {
    const exists = await SkillMaster.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (exists) {
      return { success: false, message: "Skill already exists" };
    }
    const skill = new SkillMaster({ name });
    await skill.save();
    return { success: true, data: skill, message: "Skill created successfully" };
  }

  static async getAllSkills() {
    const skills = await SkillMaster.find().sort({ name: 1 });
    return { success: true, data: skills };
  }
}