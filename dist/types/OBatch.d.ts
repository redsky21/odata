import { OdataConfig } from "./OdataConfig";
import { OdataQuery } from "./OdataQuery";
import { ORequest } from "./ORequest";
export declare class OBatch {
    private changeset;
    private batchBody;
    private batchUid;
    private batchConfig;
    constructor(resources: ORequest[], config: OdataConfig, query?: OdataQuery, changeset?: boolean);
    fetch(url: URL): Promise<any>;
    parseResponse(responseData: string, contentTypeHeader: string): any;
    /**
     * If we determine a changset (POST, PUT, PATCH) we initalize a new
     * OBatch instance for it.
     */
    private checkForChangset;
    private getGETResources;
    private getChangeResources;
    private getBody;
    private getUid;
    private getHeaders;
    private getRequestURL;
}
