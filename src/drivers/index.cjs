const includes = [
    require("./aws/aws.driver.cjs"),
    require("./local/local.driver.cjs"),
    require("./timeweb/timeweb.driver.cjs"),
    require("./yandex/yandex.driver.cjs"),
];

const list = includes.reduce((ret, itm) => {
    ret[itm.getDescription().id] = itm;
    return ret;
}, {});

module.exports = list;
