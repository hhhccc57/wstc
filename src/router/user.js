const {login} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (60*60*24*1000))
    return d.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method
    /**
     * @des 登录
     */
    if (method === 'GET' && req.path === '/api/user/login') {
        // const username = req.body['username']
        // const password = req.body['password']
        const {username, password} = req.query
        res.setHeader('Set-cookie', [
            `username=${username};path=/;httpOnly;expires=${getCookieExpires()}`,
            `password=${password};path=/;httpOnly;expires=${getCookieExpires()}`,
        ])
        return login(username, password).then( (data) => {
            return data.username ? new SuccessModel(data) : new ErrorModel('登录失败')
        })
    }

    if (method === 'GET' && req.path === '/api/user/loginTest') {
        return req.cookie['username'] ?
            Promise.resolve(new SuccessModel()) :
            Promise.resolve(new ErrorModel('尚未登录'))
    }
}

module.exports = handleUserRouter
