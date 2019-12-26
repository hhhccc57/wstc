const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const queryString = require('querystring')
const SESSION_DATA = {}

/**
 * @des 服务器handle
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
const serverHandle = async (req, res) => {
    res.setHeader('Content-type', 'application-json')

    let url = req.url
    req.path = analysisUrl(url.split('?')[0])
    req.query = queryString.parse(url.split('?')[1])
    req.body = await getPostDate(req)
    req.cookie = analysisCookie(req)
    const quoteParam = {needSetCookie: false, userID: ''}
    req.session = analysisSession(req, quoteParam) // 赋值得到的对象 改动影响原对象
    console.log(quoteParam)
    /** blog路由 */
    const blogDate = handleBlogRouter(req, res)
    if (blogDate) {
        blogDate.then( (data) => {
            quoteParam.needSetCookie && res.setHeader('Set-cookie', [
                `userID=${quoteParam.userID};path=/;httpOnly;expires=${getCookieExpires()}`,
            ])
            res.end(JSON.stringify(data))
        })
        return
    }

    /** user路由 */
    const userDate = handleUserRouter(req, res)
    if (userDate) {
        userDate.then( (data) => {
            quoteParam.needSetCookie && res.setHeader('Set-cookie', [
                `userID=${quoteParam.userID};path=/;httpOnly;expires=${getCookieExpires()}`,
            ])
            res.end(JSON.stringify(data))
        })
        return
    }

    res.writeHead(404, {'Content-type': 'text/plain'})
    res.write('404 not found')
    res.end()
}

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
 * @param req
 * @param quoteParam
 * @returns {*}
 */
const analysisSession = (req, quoteParam) => {
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

module.exports = serverHandle
