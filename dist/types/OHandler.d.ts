import { OdataConfig } from "./OdataConfig";
import { OdataQuery } from "./OdataQuery";
import { ORequest } from "./ORequest";
declare type BodyType = Blob | BufferSource | FormData | URLSearchParams | string | object;
export declare class OHandler {
    config: OdataConfig;
    private requests;
    constructor(config: OdataConfig);
    /**
     * Does a fetch request to the given endpoint and request
     * all resources in sequent. Tries to parse the result logical
     * so that no further processing is used. If the result is only one
     * entity a object is returned, otherwise a array of objects.
     *
     * @example
     * ```typescript
     *  const russell = await o('https://services.odata.org/TripPinRESTierService/')
     *  .get('People('russellwhyte')
     *  .query();
     *
     *  console.log(russell); // shows: { FirstName: "Russell", LastName: "Whyte" [...] }
     * ```
     *
     * If the request fails with an error code higher then 400 it throws the
     * Response:
     *
     * @example
     * ```typescript
     *  try {
     *    const unknown = await o('https://services.odata.org/TripPinRESTierService/')
     *      .get('People('unknown')
     *      .query();
     *  } catch(res) { // Response
     *    console.log(res.status); // 404
     *  }
     * ```
     *
     * @param query The URLSearchParams that are added to the question mark on the url.
     *              That are usually the odata queries like $filter, $top, etc...
     * @returns Either an array or a object with the given entities. If multiple
     *          resources are fetched, this method returns a array of array/object. If there
     *          is no content (e.g. for delete) this method returns the Response
     */
    query(query?: OdataQuery): Promise<any>;
    /**
     * Request all requests in sequent. Does simply return a Response or Response[]
     * without any data parsing applied.
     *
     * @param query The URLSearchParams that are added to the question mark on the url.
     *              That are usually the odata queries like $filter, $top, etc...
     */
    fetch(query?: OdataQuery): Promise<Response | Response[]>;
    /**
     * Does a batch http-batch request. All request in that sequent are send via one
     * physically request and afterwards parsed to separate data chunks.
     *
     * @param query The URLSearchParams that are added to the question mark on the url.
     *              That are usually the odata queries like $filter, $top, etc...
     */
    batch(query?: OdataQuery): Promise<any>;
    /**
     * Gets the data from the endpoint + resource url.
     *
     * @param resource The resource to request e.g. People/$value.
     */
    get(resource?: string): this;
    /**
     * Post data to an endpoint + resource.
     *
     * @param resource The resource to post to.
     * @param body The data to post.
     */
    post(resource: string, body: BodyType): this;
    /**
     * Put data to an endpoint + resource.
     *
     * @param resource The resource to put to.
     * @param body The data to put.
     */
    put(resource: string, body: BodyType): this;
    /**
     * Patch data to an endpoint + resource.
     *
     * @param resource The resource to patch to.
     * @param body The data to patch.
     */
    patch(resource: string, body: BodyType): this;
    /**
     * Deletes a resource from the endpoint.
     *
     * @param resource The resource to delete e.g. People/1
     */
    delete(resource?: string): this;
    /**
     * Use that method to add any kind of request (e.g. a head request) to
     * the execution list.
     *
     * @example
     * ```typescript
     *   const req = new ORequest('http://full.url/healt', { method: 'HEAD'});
     *   const res = await o('http://another.url').request(req).fetch();
     *   console.log(res.status); // e.g. 200 from http://full.url/healt
     * ```
     * @param req The request to add.
     */
    request(req: ORequest): void;
    /**
     * Determines how many request are outstanding.
     */
    get pending(): number;
    /**
     * Returns a URL based on the rootURL + the given resource
     * @param resource The resource to join.
     */
    getUrl(resource: string): URL;
    private getFetch;
    private getBody;
}
export {};
