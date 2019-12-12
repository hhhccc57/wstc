const env = process.env.NODE_ENV

let MYSQL_CONF = null
if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog',
    }
} else if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog',
    }
}

module.exports = {MYSQL_CONF}
