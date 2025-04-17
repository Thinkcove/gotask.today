import mongoose from "mongoose";
import { Role } from "../../../gotask_api/src/domain/model/role";

const roles = [
  { name: "Admin", priority: 1 },
  { name: "HR", priority: 2 },
  { name: "Manager", priority: 3 },
  { name: "Associate", priority: 4 }
];

const seedRoles = async () => {
  try {
    await mongoose.connect("mongodb+srv://rizwana:rizwana%40123@cluster0.tb7eb.mongodb.net/");

    for (const role of roles) {
      const exists = await Role.findOne({ name: role.name });
      if (!exists) {
        await Role.create(role);
        console.log(`Seeded role: ${role.name}`);
      }
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding roles", err);
    mongoose.disconnect();
  }
};

seedRoles();
