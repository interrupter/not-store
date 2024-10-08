import notPath from "not-path";
const OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY = ["_id", "id", "ID"],
    DEFAULT_FILTER = {},
    DEFAULT_SEARCH = "",
    DEFAULT_RETURN = {},
    DEFAULT_PAGE_NUMBER = 1,
    DEFAULT_PAGE_SIZE = 10,
    DEFAULT_ACTION_PREFIX = "$";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class netInterface {
    constructor(manifest, options) {
        this.options = options;
        this.manifest = manifest;
        this.working = {};
        this.initActions();
        return this;
    }

    initActions() {
        if (this.getActionsCount() > 0) {
            let actions = this.getActions();
            for (let actionName in actions) {
                this.initAction(actionName, actions[actionName]);
            }
        }
    }

    initAction(actionName) {
        if (!Object.hasOwn(this, [DEFAULT_ACTION_PREFIX + actionName])) {
            this[DEFAULT_ACTION_PREFIX + actionName] = (
                opts,
                headers,
                fileUpload = false,
                files
            ) =>
                this.request(
                    this,
                    actionName,
                    opts,
                    headers,
                    fileUpload,
                    files
                );
        }
    }

    request(
        record,
        actionName,
        params,
        headers = {},
        fileUpload = false,
        files
    ) {
        let compositeData = Object.assign({}, record, params);
        let actionData = this.getActionData(actionName),
            requestParams = this.collectRequestData(actionData),
            requestParamsEncoded = this.encodeRequest(requestParams),
            //id = this.getID(compositeData, actionData, actionName),
            apiServerURL = this.getServerURL(),
            url = this.getURL(compositeData, actionData, actionName),
            opts = {};
        if (fileUpload) {
            url = this.getURL(params, actionData, actionName);
            console.log("request url for file upload", url);
            const fd = new FormData();
            fd.append("file", files);
            opts.body = fd;
        } else {
            if (
                ["OPTIONS", "GET"].indexOf(actionData.method.toUpperCase()) ===
                -1
            ) {
                opts = {
                    body: record,
                };
            }
        }
        opts.method = actionData.method.toUpperCase();
        if (headers) {
            opts.headers = headers;
        }
        return fetch(apiServerURL + url + requestParamsEncoded, opts).then(
            (response) => response.json()
        );
    }

    getModelName() {
        return this && this.manifest ? this.manifest.model : null;
    }

    getActionData(actionName) {
        return this.getActions() && this.getActions()[actionName]
            ? this.getActions()[actionName]
            : null;
    }

    getActionsCount() {
        return this.getActions() ? Object.keys(this.getActions()).length : 0;
    }

    getActions() {
        return this.manifest && this.manifest.actions
            ? this.manifest.actions
            : {};
    }

    parseParams(start, end, line, record) {
        let fieldName = "";
        let len = start.length;
        while (line.indexOf(start) > -1) {
            let ind = line.indexOf(start);
            let startSlice = ind + len;
            let endSlice = line.indexOf(end);
            fieldName = line.slice(startSlice, endSlice);
            if (fieldName == "") break;
            console.log(
                start + fieldName + end,
                notPath.get(fieldName, record)
            );
            line = line.replace(
                start + fieldName + end,
                notPath.get(fieldName, record)
            );
        }
        return line;
    }

    parseLine(line, record, actionName) {
        line = line.replace(":modelName", this.manifest.model);
        line = line.replace(":actionName", actionName);
        line = this.parseParams(":record[", "]", line, record);
        line = this.parseParams(":", "?", line, record);
        return line;
    }

    getURL(record, actionData, actionName) {
        var line =
            this.parseLine(this.manifest.url, record, actionName) +
            (Object.hasOwn(actionData, "postFix")
                ? this.parseLine(actionData.postFix, record, actionName)
                : "");
        return line;
    }

    getServerURL() {
        return this.options.server;
    }

    encodeRequest(data) {
        let p = "?";
        for (let t in data) {
            if (typeof data[t] !== "undefined" && data[t] !== null) {
                p +=
                    encodeURIComponent(t) +
                    "=" +
                    encodeURIComponent(
                        data[t].constructor === Object
                            ? JSON.stringify(data[t])
                            : data[t]
                    ) +
                    "&";
            }
        }
        //for test purpose only, special test server needed
        if (this.options.test) {
            p += "&test=1";
            if (this.options.test.session) {
                p += "&session=" + this.options.test.session;
            }
            if (this.options.test.session) {
                p += "&role=" + this.options.test.role;
            }
        }
        return p;
    }

    collectRequestData(actionData) {
        let requestData = {};
        if (
            Object.hasOwn(actionData, "data") &&
            Array.isArray(actionData.data)
        ) {
            for (let i = 0; i < actionData.data.length; i++) {
                let dataProviderName =
                    "get" + capitalizeFirstLetter(actionData.data[i]);
                if (
                    this[dataProviderName] &&
                    typeof this[dataProviderName] === "function"
                ) {
                    let data = this[dataProviderName](),
                        res = {};
                    if (
                        [
                            "pager",
                            "sorter",
                            "filter",
                            "search",
                            "return",
                        ].indexOf(actionData.data[i]) > -1
                    ) {
                        res[actionData.data[i]] = data;
                    } else {
                        res = data;
                    }
                    requestData = Object.assign(requestData, res);
                }
            }
        }
        return requestData;
    }

    getID(record, actionData) {
        let resultId,
            list = OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY,
            prefixes = ["", this.manifest.model];
        if (Object.hasOwn(actionData, "index") && actionData.index) {
            list = [actionData.index].concat(
                OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY
            );
        }
        for (let pre of prefixes) {
            for (let t of list) {
                if (Object.hasOwn(record, pre + t)) {
                    resultId = record[pre + t];
                    break;
                }
            }
        }
        return resultId;
    }

    setFindBy(key, value) {
        var obj = {};
        obj[key] = value;
        return this.setFilter(obj);
    }

    setFilter(filterData = DEFAULT_FILTER) {
        notPath.set("filter", this.working, filterData);
        return this;
    }

    resetFilter() {
        return this.setFilter();
    }

    getFilter() {
        return notPath.get("filter", this.working);
    }

    setSearch(searchData = DEFAULT_SEARCH) {
        notPath.set("search", this.working, searchData);
        return this;
    }

    resetSearch() {
        return this.setSearch();
    }

    getSearch() {
        return notPath.get("search", this.working);
    }

    setSorter(sorterData) {
        notPath.set("sorter", this.working, sorterData);
        return this;
    }

    resetSorter() {
        return this.setSorter({});
    }

    getSorter() {
        return notPath.get("sorter", this.working);
    }

    setReturn(returnData = DEFAULT_RETURN) {
        notPath.set("return", this.working, returnData);
        return this;
    }

    resetReturn() {
        return this.setReturn({});
    }

    getReturn() {
        return notPath.get("return", this.working);
    }

    setPageNumber(pageNumber) {
        notPath.set("pager.page", this.working, pageNumber);
        return this;
    }

    setPageSize(pageSize) {
        notPath.set("pager.size", this.working, pageSize);
        return this;
    }

    setPager(pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER) {
        if (pageSize.constructor === Number) {
            notPath.set("pager", this.working, {
                page: pageNumber,
                size: pageSize,
            });
        } else if (pageSize.constructor === Object) {
            notPath.set("pager", this.working, {
                page: pageSize.page || DEFAULT_PAGE_NUMBER,
                size: pageSize.size || DEFAULT_PAGE_SIZE,
            });
        }
        return this;
    }

    resetPager() {
        return this.setPager();
    }

    getPager() {
        return notPath.get("pager", this.working);
    }
}

export default netInterface;
