import OrganizationMessages from "../../constants/apiMessages/organizationMessage";
import {
  createNewOrganization,
  findAllOrganizations
} from "../../domain/interface/organization/organizationInterface";
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
      data: createOrganization
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

export { createOrganization, getAllOrganizations };
