import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import AssetController from "./assetsController";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const assetController = new AssetController();
const tags = [API, "Asset"];
const AssetRoutes = [];

const appName = APPLICATIONS.ASSET;

// Route: Create Asset
AssetRoutes.push({
  path: API_PATHS.CREATE_ASSET,
  method: API_METHODS.POST,
  // handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
  //   assetController.createAsset(new RequestHelper(request), handler)
  // ),
  handler: (request: Request, handler: ResponseToolkit) =>
    assetController.createAsset(new RequestHelper(request), handler),
  config: {
    notes: "Create new asset",
    tags
    // auth: {
    //   strategy: authStrategy.SIMPLE
    // }
  }
});

// Route: Get User by ID
AssetRoutes.push({
  path: API_PATHS.GET_ASSET_BY_ID,
  method: API_METHODS.GET,
  // handler: permission(appName, ACTIONS.VIEW, (request: Request, handler: ResponseToolkit) =>
  //   assetController.getAssetById(new RequestHelper(request), handler)
  // ),
  handler: (request: Request, handler: ResponseToolkit) =>
    assetController.getAssetById(new RequestHelper(request), handler),
  config: {
    notes: "Get Asset by ID",
    tags
    // auth: {
    //   strategy: authStrategy.SIMPLE
    // }
  }
});

AssetRoutes.push({
  path: API_PATHS.GET_ASSETS,
  method: API_METHODS.GET,
  // handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
  //   assetController.getAllAssets(new RequestHelper(request), handler)
  // ),
  handler: (request: Request, handler: ResponseToolkit) =>
    assetController.getAllAssets(new RequestHelper(request), handler),
  config: {
    notes: "Get all assets",
    tags
    // auth: {
    //   strategy: authStrategy.SIMPLE
    // }
  }
});

AssetRoutes.push({
  path: API_PATHS.DELETE_ASSET,
  method: API_METHODS.POST,
  // handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
  //   assetController.deleteAsset(new RequestHelper(request), handler)
  // ),
  handler: (request: Request, handler: ResponseToolkit) =>
    assetController.deleteAsset(new RequestHelper(request), handler),
  config: {
    notes: "Delete asset by ID",
    tags
    // auth: {
    //   strategy: authStrategy.SIMPLE
    // }
  }
});

export default AssetRoutes;
