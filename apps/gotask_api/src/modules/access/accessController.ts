import { Request, ResponseToolkit } from "@hapi/hapi";
import { AccessService } from "./accessService";
import { errorResponse, successResponse } from "../../helpers/responseHelper";
import { IAccess } from "../../domain/model/access";

// Create Access
export const createAccess = async (request: Request, h: ResponseToolkit) => {
  try {
    const accessData = request.payload as any;
    if (!accessData.name || !accessData.application) {
      return errorResponse(h, "Name and Application fields are required", 400);
    }

    const newAccess = await AccessService.createAccess(accessData);
    return successResponse(h, newAccess, 201);
  } catch (error) {
    console.error("Error creating access:", error);
    return errorResponse(h, "Failed to create access", 500);
  }
};

// Get All Accesses
export const getAllAccesses = async (_request: Request, h: ResponseToolkit) => {
  try {
    const accesses = await AccessService.getAllAccesses();
    return successResponse(h, accesses);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve accesses", 500);
  }
};

// Get Access by ID
export const getAccessById = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const access = await AccessService.getAccessById(id);
    if (!access) {
      return errorResponse(h, "Access not found", 404);
    }
    return successResponse(h, access);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve access", 500);
  }
};

// Update Access by ID
export const updateAccess = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const payload = request.payload as Partial<IAccess>;

    const updatedAccess = await AccessService.updateAccessById(id, payload);
    if (!updatedAccess) {
      return errorResponse(h, "Access not found", 404);
    }

    return successResponse(h, updatedAccess, 200);
  } catch (error) {
    console.error("Error updating access:", error);
    return errorResponse(h, "Failed to update access", 500);
  }
};

// Delete Access by ID
export const deleteAccess = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const deleted = await AccessService.deleteAccessById(id);
    if (!deleted) {
      return errorResponse(h, "Access not found", 404);
    }

    return successResponse(h, { message: "Access deleted successfully" }, 200);
  } catch (error) {
    console.error("Error deleting access:", error);
    return errorResponse(h, "Failed to delete access", 500);
  }
};
