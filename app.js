const {getCookieExpires, analysisSession, analysisUrl, analysisCookie, getPostDate} = require('./serverHandleHelper')
const {set, get} = require('./src/db/redis')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const queryString = require('querystring')

// const SESSION_DATA = {}

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
    req.session = await analysisSession(req, quoteParam) // 赋值得到的对象 改动影响原对象
    req.userID = quoteParam.userID

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


module.exports = serverHandle
