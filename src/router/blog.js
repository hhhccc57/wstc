const {getList, detailBlog, newBlog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const handleBlogRouter = (req, res) => {
    const method = req.method

    /**
     * @des 博客列表
     */
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        return getList(author, keyword).then((res) => {
            return new SuccessModel(res)
        })
    }

    /**
     * @des 博客详细内容
     */
    if (method === 'POST' && req.path === '/api/blog/detail') {
        const id = req.body['id'] || ''
        return detailBlog(id).then( (data) => {
            return new SuccessModel(data)
        })
    }

    /**
     * @des 创建博客
     */
    if (method === 'POST' && req.path === '/api/blog/new') {
        const title = req.body['title'] || ''
        const content = req.body['content'] || ''
        const author = req.body['author'] || ''
        return newBlog(title, content, author).then( (data) => {
            return new SuccessModel(data)
        })
    }


    /**
     * @des 博客更新
     */
    if (method === 'POST' && req.path === '/api/blog/update') {
        const id = req.body['id'] || ''
        const title = req.body['title'] || ''
        const content = req.body['content'] || ''
        return updateBlog(id, title, content).then( (res) => {
            return res ? new SuccessModel() : new ErrorModel('更新失败')
        })
    }

    /**
     * @des 博客删除
     */
    if (method === 'POST' && req.path === '/api/blog/del') {
        const id = req.body['id'] || ''
        return delBlog(id).then( (res) => {
            return res ? new SuccessModel() : new ErrorModel('删除失败')
        })
    }
}

module.exports = handleBlogRouter
