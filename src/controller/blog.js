/**
 * @des 博客列表
 * @param author
 * @param keyword
 * @returns {[null,null]}
 */
const getList = (author, keyword) => {
    return [
        {
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 1575529238652,
            author: 'wstc',
        }, {
            id: 2,
            title: '标题B',
            content: '内容B',
            createTime: 1575529360490,
            author: '大花',
        },
    ]
}

/**
 * @des 博客详细内容
 * @param id
 * @returns {{id: number, content: string, title: string}}
 */
const detailBlog = (id) => {
    return {
        id: 1,
        content: '我是内容',
        title: '系统通知',
    }
}

const updateBlog = (data) => {
    return true
}

const delBlog = (id = 0) => {
    if (id > 0) {
        return true
    } else {
        return false
    }
}

module.exports = {getList, detailBlog, updateBlog, delBlog}
