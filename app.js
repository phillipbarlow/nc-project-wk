const express = require("express");
const app = express();
const { selectTopics, getEndpoints, selectArticle,selectAllArticles, selectAllComments } = require("./controller");
app.get("/api/articles/:article_id/comments",selectAllComments)
app.get("/api/articles/:article_id", selectArticle);
app.get("/api/articles",selectAllArticles)
app.get("/api/topics", selectTopics);
app.get("/api", getEndpoints);
app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "404 error" });
  next();
});

app.use((err,req, res, next) => {
  if(err.code === '22P02'){
      res.status(400).send({msg: "Bad request"});
  }else if(err.status_code === 404){
        res.status(404).send({msg:"Article not found"})
  }else{
    next(err)
  }
});


module.exports = app;
