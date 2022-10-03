(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.odata = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var ORequest = /** @class */ (function () {
        function ORequest(url, config) {
            this.config = config;
            if (typeof url === "string") {
                this.url = new URL(url);
            }
            else {
                this.url = url;
            }
        }
        Object.defineProperty(ORequest.prototype, "fetch", {
            get: function () {
                var req = new Request(this.url.href, this.config);
                return fetch(req, this.config);
            },
            enumerable: false,
            configurable: true
        });
        ORequest.prototype.applyQuery = function (query) {
            for (var key in query) {
                if (query.hasOwnProperty(key)) {
                    if (this.url.searchParams.get(key)) {
                        this.url.searchParams.set(key, query[key]);
                    }
                    else {
                        this.url.searchParams.append(key, query[key]);
                    }
                }
            }
        };
        return ORequest;
    }());

    var CRLF = "\r\n";
    var OBatch = /** @class */ (function () {
        function OBatch(resources, config, query, changeset) {
            var _this = this;
            if (changeset === void 0) { changeset = false; }
            this.changeset = changeset;
            // "" here prevents 'undefined' at start of body under some conditions.
            this.batchBody = "";
            this.batchConfig = __assign(__assign({}, config), config.batch);
            this.batchUid = this.getUid();
            this.batchConfig.headers.set("Content-Type", "multipart/mixed; boundary=" + this.batchUid);
            if (this.batchConfig.batch.useChangset) {
                resources = this.checkForChangset(resources, query);
            }
            else {
                this.batchBody += "--" + this.batchUid;
            }
            resources.forEach(function (req) { return req.config.method === "GET" && req.applyQuery(query); });
            var contentId = 0;
            this.batchBody += resources.map(function (req) {
                contentId++;
                if (req.config.method === "GET") {
                    return [
                        "",
                        "Content-Type: application/http",
                        "Content-Transfer-Encoding: binary",
                        "",
                        req.config.method + " " + _this.getRequestURL(req) + " HTTP/1.1",
                        "" + _this.getHeaders(req),
                        "" + _this.getBody(req)
                    ].join(CRLF);
                }
                else {
                    return [
                        "",
                        "Content-Type: application/http",
                        "Content-Transfer-Encoding: binary",
                        "Content-ID: " + contentId,
                        "",
                        req.config.method + " " + _this.getRequestURL(req) + " HTTP/1.1",
                        "" + _this.getHeaders(req),
                        "" + _this.getBody(req)
                    ].join(CRLF);
                }
            }).join(CRLF + "--" + this.batchUid);
            this.batchBody += CRLF + "--" + this.batchUid + "--" + CRLF;
            if (!changeset) {
                this.batchConfig.headers.set("Content-Type", "multipart/mixed;boundary=" + this.batchUid);
            }
        }
        OBatch.prototype.fetch = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var req, res, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            req = new ORequest(url, __assign(__assign({}, this.batchConfig), { body: this.batchBody, method: "POST" }));
                            return [4 /*yield*/, req.fetch];
                        case 1:
                            res = _a.sent();
                            if (!(res.status < 400)) return [3 /*break*/, 3];
                            return [4 /*yield*/, res.text()];
                        case 2:
                            data = _a.sent();
                            return [2 /*return*/, this.parseResponse(data, res.headers.get("Content-Type"))];
                        case 3: throw res;
                    }
                });
            });
        };
        OBatch.prototype.parseResponse = function (responseData, contentTypeHeader) {
            var _this = this;
            var headers = contentTypeHeader.split("boundary=");
            var boundary = headers[headers.length - 1];
            var splitData = responseData.split("--" + boundary);
            splitData.shift();
            splitData.pop();
            var wasWithChangesetresponse = false;
            var parsedData = splitData.map(function (data) {
                var dataSegments = data.trim().split("\r\n\r\n");
                if (dataSegments.length === 0) {
                    // we are unable to parse -> return all
                    return data;
                }
                else if (dataSegments.length > 3) {
                    var header = dataSegments.find(function (x) { return x.startsWith("Content-Type: ") && x.includes("boundary=changesetresponse_"); });
                    if (!header) {
                        return data;
                    }
                    dataSegments.shift();
                    wasWithChangesetresponse = true;
                    return _this.parseResponse(dataSegments.join("\r\n\r\n"), header);
                }
                else {
                    var contentIdHeader = dataSegments[0].split("\r\n").find(function (x) { return x.startsWith("Content-ID: "); });
                    if (contentIdHeader) {
                        try {
                            var contentId = parseInt(contentIdHeader.substring(12), 10);
                        }
                        catch (ex) {
                        }
                    }
                    var status = +dataSegments[1].split(" ")[1];
                    if (dataSegments.length === 3) {
                        // if length == 3 we have a body, try to parse if JSON and return that!
                        var body;
                        try {
                            var parsed = JSON.parse(dataSegments[2]);
                            var hasFragment = parsed[_this.batchConfig.fragment];
                            body = hasFragment || parsed;
                        }
                        catch (ex) {
                            body = dataSegments[2];
                        }
                    }
                    return { contentId: contentId, status: status, body: body };
                }
            });
            if (wasWithChangesetresponse) {
                return parsedData[0];
            }
            return parsedData;
        };
        /**
         * If we determine a changset (POST, PUT, PATCH) we initalize a new
         * OBatch instance for it.
         */
        OBatch.prototype.checkForChangset = function (resources, query) {
            var changeRes = this.getChangeResources(resources);
            if (this.changeset) {
                this.batchBody += [
                    "",
                    "Content-Type: multipart/mixed;boundary=" + this.batchUid,
                    "",
                    "--" + this.batchUid
                ].join(CRLF);
            }
            else if (changeRes.length > 0) {
                this.batchBody = "--" + this.batchUid;
                this.batchBody += new OBatch(changeRes, this.batchConfig, query, true).batchBody;
                resources = this.getGETResources(resources);
            }
            else {
                this.batchBody = "--" + this.batchUid;
            }
            return resources;
        };
        OBatch.prototype.getGETResources = function (resources) {
            return resources.filter(function (req) { return req.config.method === "GET"; });
        };
        OBatch.prototype.getChangeResources = function (resources) {
            return resources.filter(function (req) { return req.config.method !== "GET"; });
        };
        OBatch.prototype.getBody = function (req) {
            if (req.config.body) {
                return "" + req.config.body + CRLF + CRLF;
            }
            return "";
        };
        OBatch.prototype.getUid = function () {
            var d = new Date().getTime();
            var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === "x" ? r : (r & 0x7) | 0x8).toString(16);
            });
            return "" + (this.changeset
                ? this.batchConfig.batch.changsetBoundaryPrefix
                : this.batchConfig.batch.boundaryPrefix) + uuid;
        };
        OBatch.prototype.getHeaders = function (req) {
            // Request headers can be Headers | string[][] | Record<string, string>.
            // A new Headers instance around them allows treatment of all three types
            // to be the same. This also applies security last two could bypass.
            var headers = new Headers(req.config.headers || undefined);
            // Convert each header to single string.
            // Headers is iterable. Array.from is needed instead of Object.keys.
            var mapped = Array.from(headers).map(function (_a) {
                var k = _a[0], v = _a[1];
                return k + ": " + v;
            });
            if (mapped.length) {
                // Need to ensure a blank line between HEADERS and BODY. When there are
                // headers, it must be added here. Otherwise blank is added in ctor.
                mapped.push("");
            }
            return mapped.join(CRLF);
        };
        OBatch.prototype.getRequestURL = function (req) {
            var href = req.url.href;
            if (this.batchConfig.batch.useRelativeURLs) {
                // Strip away matching root from request.
                href = href.replace(this.batchConfig.rootUrl.href, "");
            }
            return href;
        };
        return OBatch;
    }());

    var OHandler = /** @class */ (function () {
        function OHandler(config) {
            this.config = config;
            this.requests = [];
        }
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
        OHandler.prototype.query = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var response, json, ex_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, 4, 5]);
                            this.config.onStart(this);
                            return [4 /*yield*/, this.getFetch(query)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, Promise.all(response.map(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                    var data, ex_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(res.status >= 400)) return [3 /*break*/, 1];
                                                this.config.onError(this, res);
                                                throw res;
                                            case 1:
                                                if (!(res.ok && res.json)) return [3 /*break*/, 6];
                                                _a.label = 2;
                                            case 2:
                                                _a.trys.push([2, 4, , 5]);
                                                this.config.onFinish(this, res);
                                                return [4 /*yield*/, res.json()];
                                            case 3:
                                                data = _a.sent();
                                                return [2 /*return*/, data[this.config.fragment] || data];
                                            case 4:
                                                ex_2 = _a.sent();
                                                return [2 /*return*/, res];
                                            case 5: return [3 /*break*/, 8];
                                            case 6: return [4 /*yield*/, res.text()];
                                            case 7: return [2 /*return*/, _a.sent()];
                                            case 8: return [2 /*return*/];
                                        }
                                    });
                                }); }))];
                        case 2:
                            json = _a.sent();
                            return [2 /*return*/, json.length > 1 ? json : json[0]];
                        case 3:
                            ex_1 = _a.sent();
                            throw ex_1;
                        case 4:
                            this.requests = [];
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Request all requests in sequent. Does simply return a Response or Response[]
         * without any data parsing applied.
         *
         * @param query The URLSearchParams that are added to the question mark on the url.
         *              That are usually the odata queries like $filter, $top, etc...
         */
        OHandler.prototype.fetch = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var fetch_1, ex_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            this.config.onStart(this);
                            return [4 /*yield*/, this.getFetch(query)];
                        case 1:
                            fetch_1 = _a.sent();
                            return [2 /*return*/, fetch_1.length === 1 ? fetch_1[0] : fetch_1];
                        case 2:
                            ex_3 = _a.sent();
                            this.config.onError(this, ex_3);
                            throw ex_3;
                        case 3:
                            this.config.onFinish(this);
                            this.requests = [];
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Does a batch http-batch request. All request in that sequent are send via one
         * physically request and afterwards parsed to separate data chunks.
         *
         * @param query The URLSearchParams that are added to the question mark on the url.
         *              That are usually the odata queries like $filter, $top, etc...
         */
        OHandler.prototype.batch = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var batch, url, data, ex_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            batch = new OBatch(this.requests, this.config, query);
                            url = this.getUrl(this.config.batch.endpoint);
                            return [4 /*yield*/, batch.fetch(url)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, data];
                        case 2:
                            ex_4 = _a.sent();
                            throw ex_4;
                        case 3:
                            this.requests = [];
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Gets the data from the endpoint + resource url.
         *
         * @param resource The resource to request e.g. People/$value.
         */
        OHandler.prototype.get = function (resource) {
            if (resource === void 0) { resource = ""; }
            var url = this.getUrl(resource);
            var request = new ORequest(url, __assign(__assign({}, this.config), { method: "GET" }));
            this.requests.push(request);
            return this;
        };
        /**
         * Post data to an endpoint + resource.
         *
         * @param resource The resource to post to.
         * @param body The data to post.
         */
        OHandler.prototype.post = function (resource, body) {
            if (resource === void 0) { resource = ""; }
            var url = this.getUrl(resource);
            var request = new ORequest(url, __assign(__assign({}, this.config), { method: "POST", body: this.getBody(body) }));
            this.requests.push(request);
            return this;
        };
        /**
         * Put data to an endpoint + resource.
         *
         * @param resource The resource to put to.
         * @param body The data to put.
         */
        OHandler.prototype.put = function (resource, body) {
            if (resource === void 0) { resource = ""; }
            var url = this.getUrl(resource);
            var request = new ORequest(url, __assign(__assign({}, this.config), { method: "PUT", body: this.getBody(body) }));
            this.requests.push(request);
            return this;
        };
        /**
         * Patch data to an endpoint + resource.
         *
         * @param resource The resource to patch to.
         * @param body The data to patch.
         */
        OHandler.prototype.patch = function (resource, body) {
            if (resource === void 0) { resource = ""; }
            var url = this.getUrl(resource);
            var request = new ORequest(url, __assign(__assign({}, this.config), { body: this.getBody(body), method: "PATCH" }));
            this.requests.push(request);
            return this;
        };
        /**
         * Deletes a resource from the endpoint.
         *
         * @param resource The resource to delete e.g. People/1
         */
        OHandler.prototype.delete = function (resource) {
            if (resource === void 0) { resource = ""; }
            var url = this.getUrl(resource);
            var request = new ORequest(url, __assign(__assign({}, this.config), { method: "DELETE" }));
            this.requests.push(request);
            return this;
        };
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
        OHandler.prototype.request = function (req) {
            this.requests.push(req);
        };
        Object.defineProperty(OHandler.prototype, "pending", {
            /**
             * Determines how many request are outstanding.
             */
            get: function () {
                return this.requests.length;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns a URL based on the rootURL + the given resource
         * @param resource The resource to join.
         */
        OHandler.prototype.getUrl = function (resource) {
            return new URL(resource, this.config.rootUrl);
        };
        OHandler.prototype.getFetch = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var result, _i, _a, req, request;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(this.pending > 1)) return [3 /*break*/, 5];
                            result = [];
                            _i = 0, _a = this.requests;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            req = _a[_i];
                            req.applyQuery(__assign(__assign({}, this.config.query), query));
                            return [4 /*yield*/, req.fetch];
                        case 2:
                            request = _b.sent();
                            result.push(request);
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, result];
                        case 5:
                            this.requests[0].applyQuery(__assign(__assign({}, this.config.query), query));
                            return [4 /*yield*/, this.requests[0].fetch];
                        case 6: return [2 /*return*/, [_b.sent()]];
                    }
                });
            });
        };
        OHandler.prototype.getBody = function (body) {
            if (typeof body === "object") {
                return JSON.stringify(body);
            }
            return body;
        };
        return OHandler;
    }());

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
    function o(rootUrl, config) {
        if (config === void 0) { config = {}; }
        // polyfill fetch if we have no fetch
        var env = typeof window !== "undefined" ? window : global;
        if (!("fetch" in env) &&
            !config.disablePolyfill &&
            typeof window !== "undefined") {
            throw new Error("No polyfill found for fetch(). You need to include dist/umd/o.polyfill.js to work with older browsers");
        }
        if (!("fetch" in env) &&
            !config.disablePolyfill &&
            typeof window === "undefined") {
            require("cross-fetch/polyfill");
        }
        if (!("URL" in env) &&
            !config.disablePolyfill &&
            typeof window !== "undefined") {
            throw new Error("No polyfill found for URL(). You need to include dist/umd/o.polyfill.js to work with older browsers");
        }
        if (!("URL" in env) &&
            !config.disablePolyfill &&
            typeof window === "undefined") {
            require("universal-url").shim();
        }
        // set the default configuration values
        var defaultConfigValues = {
            batch: {
                boundaryPrefix: "batch_",
                changsetBoundaryPrefix: "changset_",
                endpoint: "$batch",
                headers: new Headers({
                    "Content-Type": "multipart/mixed",
                }),
                useChangset: false,
                useRelativeURLs: false,
            },
            credentials: "omit",
            fragment: "value",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            mode: "cors",
            redirect: "follow",
            referrer: "client",
            onStart: function () { return null; },
            onError: function () { return null; },
            onFinish: function () { return null; },
        };
        var mergedConfig = __assign(__assign({}, defaultConfigValues), config);
        if (typeof rootUrl === "string") {
            try {
                // we assuming a resource
                var configUrl = (mergedConfig.rootUrl ||
                    window.location.href);
                rootUrl = new URL(rootUrl, configUrl.endsWith("/") ? configUrl : configUrl + "/");
            }
            catch (ex) {
                // no window?!
                rootUrl = new URL(rootUrl, mergedConfig.rootUrl);
            }
        }
        mergedConfig.rootUrl = rootUrl;
        return new OHandler(mergedConfig);
    }

    exports.o = o;
    exports.OBatch = OBatch;
    exports.OHandler = OHandler;
    exports.ORequest = ORequest;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=o.js.map
