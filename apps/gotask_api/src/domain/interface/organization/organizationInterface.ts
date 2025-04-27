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

// Find a organization by ID
const findOrganizationyId = async (id: string): Promise<IOrganization | null> => {
  return await Organization.findOne({ id });
};

//update org
const updateOrgById = async (
  id: string,
  updateData: Partial<IOrganization>
): Promise<IOrganization | null> => {
  return await Organization.findOneAndUpdate({ id }, updateData, { new: true });
};

export {
  createNewOrganization,
  findAllOrganizations,
  findOrganizationsByIds,
  findOrganizationyId,
  updateOrgById
};
