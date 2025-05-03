/eslint-disable /;
export const plugins = [
  {
    plugin: require("hapi-auth-bearer-token")
  },
  {
    plugin: require("@hapi/cookie")
  },
  {
    plugin: require("blipp"),
    options: {}
  }
];
