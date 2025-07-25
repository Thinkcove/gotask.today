import { IAsset } from "./asset";
import { ILaptopAsset } from "./laptop";
import { IMobileAsset } from "./mobile";
import { IAccessCardAsset } from "./access";
import { IPrinterAsset } from "./printer";
import { IFingerprintScannerAsset } from "./fingerPrint";
import { IAirConditionerAsset } from "./airConditioner";

export type IAssetsSchema = IAsset &
  ILaptopAsset &
  IMobileAsset &
  IAccessCardAsset &
  IPrinterAsset &
  IFingerprintScannerAsset &
  IAirConditionerAsset;
