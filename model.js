const db = require('./db/connection')
function getTopics (){
    const queryStr = `SELECT * FROM topics;`
    return db.query(queryStr)
    .then((result)=>{
        return result.rows;
    })
}

module.exports = {getTopics}