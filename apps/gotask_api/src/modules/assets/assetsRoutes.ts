import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import AssetController from "./assetsController";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const assetController = new AssetController();
const tags = [API, "Asset and Resources"];
const AssetRoutes = [];

const appName = APPLICATIONS.ASSET;

//Asset Type

AssetRoutes.push({
  path: "/createAssetType",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    assetController.createAssetType(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create new asset type",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

AssetRoutes.push({
  path: "/getAllType",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    assetController.getAllAssetsTypes(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get all assets types",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Create Asset
AssetRoutes.push({
  path: "/createasset",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    assetController.createAsset(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create new asset",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get User by ID
AssetRoutes.push({
  path: "/asset/{id}",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    assetController.getAssetById(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get Asset by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

AssetRoutes.push({
  path: "/assets/getAll",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    assetController.getAllAssets(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get all assets",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

AssetRoutes.push({
  path: "/asset/delete/{id}",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    assetController.deleteAsset(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Delete asset by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

AssetRoutes.push({
  path: "/getuserbyassetid/{id}",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    assetController.getUserByAssetId(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get Asset by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default AssetRoutes;
