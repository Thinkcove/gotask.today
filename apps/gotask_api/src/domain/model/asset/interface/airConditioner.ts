import { IAsset } from "./asset";

export interface IAirConditionerAsset extends IAsset {
  acType?: string;
  energyRating?: string;
  powerConsumption?: string;
  coolingCoverage?: string;
  inverterType?: string;
}
