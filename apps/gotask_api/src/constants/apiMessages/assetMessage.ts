const AssetMessages = {
  CREATE: {
    REQUIRED: "Asset data is required",
    FAILED: "Failed to create asset",
    INVALID_PAYLOAD: "Invalid Payload"
  },
  DELETE: {
    NOT_FOUND: "Asset not found",
    SUCCESS: "Asset deleted successfully",
    FAILED: "Failed to delete asset"
  },
  FETCH: {
    NOT_FOUND: "Asset not found",
    FAILED_TO_GET_ASSET: "Failed to get asset",
    ASSET_TYPE_NOT_FOUND: "Assets types not found"
  },
  UPDATE: {
    NOT_FOUND: "Asset not found",
    FAILED: "Failed to update asset"
  },
  CONFIG: {
    LOAD_FAILED: "Error loading asset configuration."
  }
};

export default AssetMessages;
