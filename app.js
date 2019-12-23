const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const queryString = require('querystring')

/**
 * @des 服务器handle
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
const serverHandle = async (req, res) => {
    res.setHeader('Content-type', 'application-json')

    const url = req.url
    req.path = url.split('?')[0]
    req.query = queryString.parse(url.split('?')[1])
    req.body = await getPostDate(req)

    const blogDate = handleBlogRouter(req, res)
    if (blogDate) {
        blogDate.then( (data) => {
            res.end(
                JSON.stringify(data),
            )
        })
        return
    }

    const userDate = handleUserRouter(req, res)
    if (userDate) {
        res.end(
            JSON.stringify(userDate),
        )
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

module.exports = serverHandle
