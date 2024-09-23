const config = require("not-config").forModule(
    require("./const.cjs").MODULE_NAME
);

function func() {
    return config.get("httpOptions") ?? {};
}

module.exports = func;
