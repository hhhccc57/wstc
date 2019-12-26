const redis = require('redis')
const {REDIS_CONF} = require('../../conf/db')

const redisClient = redis.createClient(REDIS_CONF['port'], REDIS_CONF['host'])
redisClient.on('error', (err) => {
    console.error(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get() {
    return new Promise((resolved, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            try {
                resolved(JSON.parse(val))
            } catch (ex) {
                resolved(val)
            }
        })
    })
}

module.exports = {set, get}
