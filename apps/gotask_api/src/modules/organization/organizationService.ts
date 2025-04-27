import OrganizationMessages from "../../constants/apiMessages/organizationMessage";
import {
  createNewOrganization,
  findAllOrganizations,
  findOrganizationyId,
  updateOrgById
} from "../../domain/interface/organization/organizationInterface";
import { findProjectsByIds, findUsersByIds } from "../../domain/interface/user/userInterface";
import { IOrganization } from "../../domain/model/organization/organization";

// Create a new organization
const createOrganization = async (
  organizationData: IOrganization
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    if (!organizationData) {
      return {
        success: false,
        message: OrganizationMessages.CREATE.REQUIRED
      };
    }
    const createOrganization = await createNewOrganization(organizationData);
    return {
      success: true,
      data: createOrganization,
      message: OrganizationMessages.CREATE.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || OrganizationMessages.CREATE.FAILED
    };
  }
};

//GET all organization
const getAllOrganizations = async (): Promise<{
  success: boolean;
  data?: IOrganization[];
  message?: string;
}> => {
  try {
    const organization = await findAllOrganizations();
    return {
      success: true,
      data: organization
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || OrganizationMessages.FETCH.FAILED_ALL
    };
  }
};

// GET ORG BY ID
const getOrganizationById = async (id: string) => {
  try {
    const org = await findOrganizationyId(id);
    if (!org) {
      return {
        success: false,
        message: OrganizationMessages.FETCH.NOT_FOUND
      };
    }

    // --- Enrich Project Details ---
    const projectIds = org.projects || [];
    let projectDetails = [];
    if (projectIds.length > 0) {
      // Fetch project details by IDs
      const projects = await findProjectsByIds(projectIds);

      // Map project details for quick lookup
      const projectMap = new Map(projects.map((project: any) => [project.id, project]));

      // Enrich the project details array
      projectDetails = projectIds.map((id: string) => projectMap.get(id)).filter(Boolean); // Remove undefineds
    }

    // --- Enrich User Details ---
    const userIds = org.users || [];
    let userDetails = [];
    if (userIds.length > 0) {
      // Fetch user details by IDs
      const users = await findUsersByIds(userIds);

      // Map user details for quick lookup
      const userMap = new Map(users.map((user: any) => [user.id, user]));

      // Enrich the user details array
      userDetails = userIds.map((id: string) => userMap.get(id)).filter(Boolean); // Remove undefineds
    }

    // Attach enriched data
    const orgWithDetails = {
      ...org.toObject(), // Convert org to plain object
      projectDetails,
      userDetails
    };

    return {
      success: true,
      data: orgWithDetails
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || OrganizationMessages.FETCH.FAILED_BY_ID
    };
  }
};

const updateOrgDetail = async (
  id: string,
  updateData: Partial<IOrganization>
): Promise<{ success: boolean; data?: IOrganization | null; message?: string }> => {
  try {
    const updatedOrg = await updateOrgById(id, updateData);

    if (!updatedOrg) {
      return {
        success: false,
        message: OrganizationMessages.FETCH.NOT_FOUND
      };
    }
    return {
      success: true,
      data: updatedOrg,
      message: OrganizationMessages.UPDATE.SUCCESS
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || OrganizationMessages.UPDATE.FAILED
    };
  }
};
export { createOrganization, getAllOrganizations, getOrganizationById, updateOrgDetail };
