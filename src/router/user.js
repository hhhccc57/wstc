const {login} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {set} = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method

    /** @des 登录 */
    if (method === 'GET' && req.path === '/api/user/login') {
        // const username = req.body['username']
        // const password = req.body['password']
        const {username, password} = req.query
        return login(username, password).then( (data) => {
            if (data.username) {
                req.session.username = data.username
                req.session.realname = data.realname
                set(req.userID, req.session)
                return new SuccessModel(data)
            } else {
                return new ErrorModel('登录失败')
            }
        })
    }

    if (method === 'GET' && req.path === '/api/user/logintest') {
        return req.session['username'] ?
            Promise.resolve(new SuccessModel(req.session)) :
            Promise.resolve(new ErrorModel('尚未登录'))
    }
}

module.exports = handleUserRouter
