const {set, get} = require('./src/db/redis')

/**
 * @des post 参数解析函数
 * @param req
 * @return {Promise}
 */
const getPostDate = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return false
        }

        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return false
        }

        let postDate = ''
        req.on('data', (data) => {
            postDate += data.toString()
        })

        req.on('end', () => {
            if (!postDate) {
                resolve({})
                return false
            }
            resolve(JSON.parse(postDate))
        })
    })
}

/**
 * @des 解析cookie
 * @param req
 * @returns {{}}
 */
const analysisCookie = (req) => {
    const cookieVal = {}
    const cookieStr = req.headers.cookie || '' // k1=1;k2=2;k3=3;
    cookieStr.split(';').forEach((item) => {
        if (item) {
            const flagArr = item.split('=')
            cookieVal[flagArr[0].trim()] = flagArr[1]
        }
    })
    return cookieVal
}


/**
 * @des 解析路径
 * @param url
 * @returns {string}
 */
const analysisUrl = (url) => {
    let res = ''
    url.split('/').forEach((item) => item && (res += `/${item.toLowerCase()}`))
    return res
}

/**
 * @des 解析 session
 * @param req 请求
 * @param quoteParam 利用对象复制应用原理修改的参数
 * @returns {*}
 */
const analysisSession = async (req, quoteParam) => {
    quoteParam.userID = req.cookie.userID
    let res = {}
    /** 获得 userID */
    if (!quoteParam.userID) {
        quoteParam.needSetCookie = true
        quoteParam.userID = `${Date.now()}_${Math.random()}`
        set(quoteParam.userID, {})
    }

    /** 从内存里获取 */
    await get(quoteParam.userID).then((data) => {
        console.log(data);
        (data === null || data === undefined) ?
            set(quoteParam.userID, {}) :
            res = data
    })
    return res
}


/**
 * @des 设置超时时间
 * @returns {*}
 */
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (60*60*24*1000))
    return d.toGMTString()
}

module.exports = {getCookieExpires, analysisSession, analysisUrl, analysisCookie, getPostDate}
