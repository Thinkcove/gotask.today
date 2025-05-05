import HapiAuthBearer from "hapi-auth-bearer-token";
import HapiCookie from "@hapi/cookie";

export const plugins = [
  {
    plugin: HapiAuthBearer
  },
  {
    plugin: HapiCookie
  }
];
