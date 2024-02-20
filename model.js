const db = require('./db/connection')
exports.getTopics = () =>{
    const queryStr = `SELECT * FROM topics;`
    return db.query(queryStr)
    .then((result)=>{
        return result.rows;
    })
}

