const {login} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method
    if (method === 'POST' && req.path === '/api/user/login') {
        const username = req.body['username']
        const password = req.body['password']
        const resData = login(username, password)
        return new SuccessModel(resData)
    }
}

module.exports = handleUserRouter
