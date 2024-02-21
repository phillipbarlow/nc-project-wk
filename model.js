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

