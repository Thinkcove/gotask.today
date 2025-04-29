import mongoose from "mongoose";
import { Role } from "../domain/model/role/role";

const roles = [{ name: "Admin" }, { name: "HR" }, { name: "Manager" }, { name: "Associate" }];

const seedRoles = async () => {
  try {
    await mongoose.connect("");

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
