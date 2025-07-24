import { IAsset } from "./asset";

export interface ILaptopAsset extends IAsset {
  antivirus?: boolean;
  recoveryKey?: string;
  isEncrypted?: boolean;
  lastServicedDate?: Date;
  commentService?: string;
  erk?: string;
}
