const cors = require('cors');

const express = require("express");
const app = express();
const { selectTopics, getEndpoints, selectArticle,selectAllArticles, selectAllComments, postComment,patchArticle, deleteComment, selectAllUsers} = require("./controller");
app.use(express.json())
app.use(cors())
app.delete('/api/comments/:comment_id', deleteComment)
app.post("/api/articles/:article_id/comments",postComment)
app.get("/api/articles/:article_id/comments",selectAllComments)
app.patch("/api/articles/:article_id",patchArticle)
app.get("/api/articles/:article_id", selectArticle);
app.get("/api/articles",selectAllArticles)
app.get("/api/topics", selectTopics);
app.get("/api/users", selectAllUsers);
app.get("/api", getEndpoints);


app.use((err,req, res, next) => {
  if(err.code === '22P02' || err.status_code === 400){
    res.status(400).send({msg: "Bad request"});
  }else if(err.status_code === 404){
    res.status(404).send({msg:"Article not found"})
  }else if(err.code === '23503'){
    res.status(404).send({msg:'Invalid input'})
  }else{
    next(err)
  }
});

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "404 error" });
  next();
});
app.use((err,req, res, next)=>{
  // console.log(err,'--500 server')
  res.status(500).send({msg: "Internal server error"});
})



module.exports = app;
