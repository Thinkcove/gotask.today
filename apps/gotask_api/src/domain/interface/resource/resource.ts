import { Resource, IResource } from "../../model/resource/resource";

const createResource = async (resourceData: IResource): Promise<IResource> => {
  const newResource = new Resource(resourceData);
  return await newResource.save();
};

export { createResource };
