import { IOrganization, Organization } from "../../model/organization/organization";

// Create a new organization
const createNewOrganization = async (organizationData: IOrganization): Promise<IOrganization> => {
  const newOrganization = new Organization(organizationData);
  return await newOrganization.save();
};

// Get all organizations
const findAllOrganizations = async (): Promise<IOrganization[]> => {
  return await Organization.find().sort({ updatedAt: -1 });
};

// Get users by an array of user IDs
const findOrganizationsByIds = async (organizationIds: string[]) => {
  return await Organization.find({ id: { $in: organizationIds } });
};

export { createNewOrganization, findAllOrganizations, findOrganizationsByIds };
