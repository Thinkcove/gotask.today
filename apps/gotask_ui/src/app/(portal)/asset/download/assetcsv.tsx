import { IAssetAttributes, ITagData } from "../interface/asset";

export const downloadAssetCSV = (data: IAssetAttributes[], transasset: (key: string) => string) => {
  const csvContent = [
    [
      transasset("devicename"),
      transasset("type"),
      transasset("accesscardno"),
      transasset("personalid"),
      transasset("accesscardno2"),
      transasset("issuedon"),
      transasset("warranty"),
      transasset("model"),
      transasset("purchaseDate"),
      transasset("assigned"),
      transasset("storage"),
      transasset("ram"),
      transasset("os"),
      transasset("processor"),
      transasset("seller"),
      transasset("warrantyPeriod"),
      transasset("imeiNumber"),
      transasset("screenSize"),
      transasset("batteryCapacity"),
      transasset("cameraSpecs"),
      transasset("simType"),
      transasset("insuranceProvider"),
      transasset("insurancePolicyNumber"),
      transasset("insuranceExpiry")
    ],
    ...data.map((item) => [
      item.deviceName,
      item.assetType?.name,
      item.accessCardNo,
      item.personalId,
      item.accessCardNo2,
      item.issuedOn,
      item.warrantyDate,
      item.modelName,
      item.dateOfPurchase,
      item.tagData?.map((tag: ITagData) => tag?.user?.name) || "-",
      item.storage,
      item.ram,
      item.os,
      item.processor,
      item.seller,
      item.warrantyPeriod,
      item.imeiNumber,
      item.screenSize,
      item.batteryCapacity,
      item.cameraSpecs,
      item.simType,
      item.insuranceProvider,
      item.insurancePolicyNumber,
      item.insuranceExpiry
    ])
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "assets.csv");
  link.click();
};
