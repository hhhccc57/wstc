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

    global.needSetCookie = false
    let url = req.url
    req.path = analysisUrl(url.split('?')[0])
    req.query = queryString.parse(url.split('?')[1])
    req.body = await getPostDate(req)
    req.cookie = analysisCookie(req)
    req.session = analysisSession()


    /** blog路由 */
    const blogDate = handleBlogRouter(req, res)
    if (blogDate) {
        blogDate.then( (data) => res.end(JSON.stringify(data)))
        return
    }

    /** user路由 */
    const userDate = handleUserRouter(req, res)
    if (userDate) {
        userDate.then( (data) => res.end(JSON.stringify(data)))
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

const analysisSession = () => {
    global.needSetCookie = true
    SESSION_DATA['aa'] = 1
}


module.exports = serverHandle
