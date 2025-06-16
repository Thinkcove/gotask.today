import env from "@/app/common/env";
import { deleteData, getData, postData, putData } from "@/app/common/utils/apiData";
import { IUserField } from "../interfaces/userInterface";
import { withAuth } from "@/app/common/utils/authToken";

export const createUser = async (
  formData: IUserField
): Promise<{ success: boolean; message?: string }> => {
  try {
    const result = await withAuth(async (token) => {
      try {
        const url = `${env.API_BASE_URL}/createUser`;
        const response = await postData(url, formData as unknown as Record<string, unknown>, token);

        return {
          success: !!response?.success,
          message: response?.message || ""
        };
      } catch (err: unknown) {
        let message = "Request failed";

        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "object" && err !== null && "message" in err) {
          message = String((err as { message?: string }).message);
        }

        return {
          success: false,
          message
        };
      }
    });

    // Type narrowing here
    if ("success" in result) {
      return {
        success: result.success,
        message: result.message
      };
    } else {
      return {
        success: false,
        message: result.error || "Unexpected error"
      };
    }
  } catch (err: unknown) {
    let message = "Unknown error occurred";

    // Check if 'err' is a proper Error object (like a thrown Error)
    if (err instanceof Error) {
      message = err.message;
    }

    // Log the error to the console for debugging
    console.error("Create user failed:", err);

    // Return a structured error response
    return {
      success: false,
      message
    };
  }
};

export const updateUser = async (userId: string, updatedFields: IUserField) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/updateUser/${userId}`;
    return putData(url, updatedFields as unknown as Record<string, unknown>, token);
  });
};

// deleteUser
export const deleteUser = async (userId: string) => {
  return withAuth((token) => {
    const url = `${env.API_BASE_URL}/deleteUser/${userId}`;
    return deleteData(url, token);
  });
};

//fetch users
export const fetchUsers = async () => {
  return withAuth(async (token) => {
    const { data } = await getData(`${env.API_BASE_URL}/getAllUsers`, token);
    return (
      data?.map(
        (user: {
          first_name: string;
          last_name: string;
          emp_id: string;
          joined_date: Date;
          name: string;
          id: string;
          mobile_no: string;
          status: string;
          user_id: string;
          createdAt: string;
          updatedAt: string;
          projects: string[];
          organizations: string[];
          role: string;
          address: string;
          country: string;
          state: string;
          alternate_no?: string;
          skills?: string[];
          certifications?: string[];
        }) => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          emp_id: user.emp_id,
          name: user.name,
          status: user.status,
          user_id: user.user_id,
          mobile_no: user.mobile_no,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          users: user.projects,
          organizations: user.organizations,
          role: user.role,
          address: user.address,
          country: user.country,
          state: user.state,
          alternate_no: user.alternate_no,
          skills: user.skills,
          certifications: user.certifications
        })
      ) || []
    );
  });
};

// Fetching data using SWR
export const fetcherUserList = async () => {
  return fetchUsers();
};
