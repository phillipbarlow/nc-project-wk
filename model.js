const db = require("./db/connection");

exports.checkTopic = ()=>{
  const queryStr = `SELECT * FROM topics;`
  return db.query(queryStr)
  .then((result)=>{
    return result
  })
  .catch((err)=>{
    console.log(err)
  })
}

exports.getTopics = () => {
  const queryStr = `SELECT * FROM topics;`;
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.getArticle = ({ article_id}) => {
  const queryStr = `SELECT * FROM articles
    WHERE article_id= $1
    GROUP BY articles.article_id`;
  return db.query(queryStr, [article_id]).then((result) => {
    const { rows } = result;
    if (rows.length < 1) {
      return Promise.reject({ msg: "Article not found", status_code: 404 });
    }
    return rows;
  });
};

exports.getArticlesCount = ({topic}) => {
  const topicContainer = []
  let queryStr = `SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url, COUNT(comment_id) :: INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id `;
  if(topic){
    topicContainer.push(topic)
    queryStr += `
    WHERE topic = $1
    `
  }
  queryStr+='GROUP BY articles.article_id ORDER BY created_at DESC;'

  return db.query(queryStr,topicContainer).then((result) => {
    const { rows } = result;
  return rows
  })
  .catch((err)=>{
    console.log(err)
  })
};

exports.getAllComments = ({ article_id }) => {
  const queryStr = `SELECT * FROM articles
    WHERE article_id= $1`;
  return db.query(queryStr, [article_id]).then((result) => {
    const { rows } = result;
    if (rows.length < 1) {
      return Promise.reject({ msg: "Article not found", status_code: 404 });
    } else {
      const stringtoQueryStr = `SELECT * FROM comments
            WHERE article_id =$1
            ORDER BY created_at DESC;`;
      return db.query(stringtoQueryStr, [article_id]).then((result) => {
        const { rows } = result;
        return rows;
      });
    }
  });
};

exports.CommentPost = ({ username, body }, { article_id }) => {
  const stringtoQuery = `SELECT * FROM comments
        WHERE author = $1;`;
  return db.query(stringtoQuery, [username]).then(() => {
    const queryStr = `INSERT INTO comments (
                body,article_id,author)
                VALUES($1,$2,$3) RETURNING *;`;
    return db
      .query(queryStr, [body, Number(article_id), username])
      .then((result) => {
        return result.rows;
      });
  });
};

exports.updateArticle = ({inc_votes},{article_id}) => {
    const queryStr = `SELECT * FROM articles
    WHERE article_id = $1;`;
    return db.query(queryStr,[article_id])
    .then(()=>{
        if(inc_votes === undefined){
            return Promise.reject({ msg: "Bad request", status_code: 400 })
        }
        const stringtoQuery = `UPDATE articles
        set votes = votes + $1 
        WHERE article_id = $2 RETURNING *;`
        return db.query(stringtoQuery, [inc_votes,article_id])
        .then((result)=>{
            if(result.rows.length < 1){
                return Promise.reject({ msg: "Article not found", status_code: 404 })
            }else{
            return result.rows
            }
        })
    })
};

exports.deleteComment = ({comment_id}) =>{
  const stringtoQuery = `SELECT * FROM comments
  WHERE comment_id = $1;`
  return db.query(stringtoQuery,[comment_id])
  .then((result)=>{
    if(result.rows.length < 1){
      return Promise.reject({ msg: "Article not found", status_code: 404 })
    }else{
      const queryStr = `SELECT * FROM comments
      WHERE comment_id = $1;`
      return db.query(queryStr,[comment_id])
      .then((result)=>{
          return result.rows
      })
      }
  })
}

exports.getAllUsers = ()=>{
  const queryStr = `SELECT * FROM users`;
  return db.query(queryStr).then((result)=>{
    return result.rows
  })
}
