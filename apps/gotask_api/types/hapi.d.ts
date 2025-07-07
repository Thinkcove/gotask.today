import "@hapi/hapi";

declare module "@hapi/hapi" {
  interface PluginSpecificConfiguration {
    metadata?: {
      module?: string;
      feature?: string;
      access?: string;
      [key: string]: any;
    };
  }
}
