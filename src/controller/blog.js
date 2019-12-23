const {exec} = require('../db/mysql')
/**
 * @des 博客列表
 * @param author
 * @param keyword
 * @returns {[null,null]}
 */
const getList = (author, keyword) => {
    let sql = 'select * from blogs where 1=1 '
    author && (sql += ` and author = '${author}'`)
    keyword && (sql += ` and title like '%${keyword}%' `)
    sql += ` order by createtime desc; `
    return exec(sql)
}

/**
 * @des 博客详细内容
 * @param id
 * @returns {{id: number, content: string, title: string}}
 */
const detailBlog = (id) => {
    const sql = `select * from blogs where id = '${id}'`
    return exec(sql).then((res) => {
        return res[0]
    })
}

/**
 * @des 创建博客
 * @param title
 * @param content
 * @param author
 * @returns {*}
 */
const newBlog = (title, content, author) => {
    const createTime = Date.now()
    const sql = `
        insert into blogs (title, content, createtime, author) 
        values ('${title}', '${content}', '${createTime}', '${author}' )
    `
    return exec(sql).then( (res) => {
        // console.log(res)
        return {
            id: res.insertId,
        }
    })
}

const updateBlog = (id, title, content) => {
    const sql = `
        update blogs set 
        title = '${title}', content = '${content}' where id = ${id}
    `
    return exec(sql).then( (res) => {
        return res.affectedRows > 0
    })
}

const delBlog = (id = 0) => {
    const sql = `delete from blogs where id = ${id}`
    return exec(sql).then( (res) => {
        return res.affectedRows > 0
    })
}

module.exports = {getList, detailBlog, newBlog, updateBlog, delBlog}
