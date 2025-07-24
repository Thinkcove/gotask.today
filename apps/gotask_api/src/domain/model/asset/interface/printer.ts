import { IAsset } from "./asset";

export interface IPrinterAsset extends IAsset {
  location?: string;
  connectivity?: string;
  printerType?: string;
  specialFeatures?: string;
  printerOutputType?: string;
  supportedPaperSizes?: string;
}
