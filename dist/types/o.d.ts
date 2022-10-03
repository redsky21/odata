import { OdataConfig } from "./OdataConfig";
import { OHandler } from "./OHandler";
/**
 * Use the 'o'-function to initialize a request directly or use the returned
 * handler to store the settings.
 *
 * Use o() directly jquery like:
 * @example
 * ```typescript
 *  await o('https://rootUrl').get('resource').query();
 * ```
 *
 * Or with a handler:
 * @example
 * ```typescript
 *  const oHandler = o('https://rootUrl');
 *  await oHandler.get('resource').query({ $top: 2 });
 * ```
 *
 * @param rootUrl The url to query
 * @param config The odata and fetch configuration.
 */
export declare function o(rootUrl: string | URL, config?: Partial<OdataConfig>): OHandler;
/**
 * Default exports
 */
export * from "./OBatch";
export * from "./OdataConfig";
export * from "./OdataQuery";
export * from "./OHandler";
export * from "./ORequest";
