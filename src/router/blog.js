const {getList, detailBlog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const handleBlogRouter = (req, res) => {
    const method = req.method

    /**
     * @des 博客列表
     */
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        const resDate = getList(author, keyword)
        return new SuccessModel(resDate)
    }

    /**
     * @des 博客详细内容
     */
    if (method === 'POST' && req.path === '/api/blog/detail') {
        const id = req.body['id'] || ''
        const resDate = detailBlog(id)
        return new SuccessModel(resDate)
    }

    /**
     * @des 博客更新
     */
    if (method === 'POST' && req.path === '/api/blog/update') {
        const resDate = updateBlog(req.body)
        if (resDate) {
            return new SuccessModel()
        } else {
            return new ErrorModel('更新失败')
        }
    }

    /**
     * @des 博客删除
     */
    if (method === 'POST' && req.path === '/api/blog/del') {
        const id = req.body['id'] || ''
        const resDate = delBlog(id)
        if (resDate) {
            return new SuccessModel()
        } else {
            return new ErrorModel('更新失败')
        }
    }
}

module.exports = handleBlogRouter
