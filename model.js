const db = require('./db/connection')
exports.getTopics = () =>{
    const queryStr = `SELECT * FROM topics;`
    return db.query(queryStr)
    .then((result)=>{
        return result.rows;
    })
}

exports.getArticle = ({article_id}) =>{
    const queryStr = `SELECT * FROM articles
    WHERE article_id= $1`
    return db.query(queryStr,[article_id])
    .then((result)=>{
        const {rows} = result;
        if(rows.length < 1){
            return Promise.reject({msg:"Article not found", status_code:404})
        }
        return rows;
    })  
}

exports.getArticlesCount = () => {

    const queryStr = `SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url, COUNT(comment_id) :: INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`

    return db.query(queryStr)
    .then((result)=>{
        const {rows} = result;
        return rows
    })
} 

