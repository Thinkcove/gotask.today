import { IAsset } from "./asset";

export interface IAirConditionerAsset extends IAsset {
  location?: string;
  connectivity?: string;
  capacity?: string;
  authenticationModes?: string;
  display?: string;
  cloudAndAppBased?: boolean;
}
