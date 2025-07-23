import { IAsset } from "./asset";

export interface IAccessCardAsset extends IAsset {
  accessCardNo?: string;
  accessCardNo2?: string;
  personalId?: string;
  issuedOn?: string;
}
