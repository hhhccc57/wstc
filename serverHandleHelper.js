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
 * @param SESSION_DATA session容器
 * @returns {*}
 */
const analysisSession = (req, quoteParam, SESSION_DATA) => {
    quoteParam.userID = req.cookie.userID
    if (quoteParam.userID) {
        SESSION_DATA[quoteParam.userID] = SESSION_DATA[quoteParam.userID] || {}
    } else {
        quoteParam.needSetCookie = true
        quoteParam.userID = `${Date.now()}_${Math.random()}`
        SESSION_DATA[quoteParam.userID] = {}
    }
    return SESSION_DATA[quoteParam.userID]
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
