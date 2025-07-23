import { IAsset } from "./asset";

export interface IFingerprintScannerAsset extends IAsset {
  location?: string;
  connectivity?: string;
  capacity?: string;
  authenticationModes?: string;
  display?: string;
  cloudAndAppBased?: boolean;
}
