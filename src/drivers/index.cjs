module.exports = {
    aws:        require('not-store/src/drivers/aws/aws.driver.cjs'),
    local:      require('not-store/src/drivers/local/local.driver.cjs'),
    timeweb:    require('not-store/src/drivers/timeweb/timeweb.driver.cjs'),
    yandex:     require('not-store/src/drivers/yandex/yandex.driver.cjs'),
};