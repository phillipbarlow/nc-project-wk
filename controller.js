const { getTopics, getArticle, getArticlesCount, getAllComments, CommentPost,updateArticle,deleteComment, getAllUsers, getAllUserTopics,checkTopic } = require("./model");
const endPoints = require("./endpoints.json");
const { query } = require("./db/connection");
exports.selectTopics = (req, res) => {
  return getTopics().then((result) => {
    res.status(200).send(result);
  });
};

exports.getEndpoints = (req, res) => {
  res.status(200).send(endPoints);
};

exports.selectArticle = (req, res, next) => {
  return getArticle(req.params).then((result) =>{
    res.status(200).send(result)
    return result
    })
    .catch((err)=>{
      next(err)
    })
}


exports.selectAllArticles = (req, res, next) => {

  return getArticlesCount(req.query)
    .then((data)=>{
      return Promise.all([data,checkTopic()])
    })
    .then((data)=>{
      const topics = data[1].rows.map(topic =>topic.slug)
      if(req.query.topic === undefined){
        res.status(200).send(data[0])
      }
      if(topics.includes(req.query.topic) === false){
        res.status(404).send({msg:"Article not found"})
      }else if(topics.includes(req.query.topic) && data[0].length === 0){
        res.status(200).send(data[0])
        return []
      }
      res.status(200).send(data[0])
    })
    .catch((err)=>{
    next(err)
    })
}

exports.selectAllComments = (req,res,next) =>{
    return getAllComments(req.params)
    .then((result)=>{
      res.status(200).send(result);
    }).catch((err)=>{
      next(err)
    })
}

exports.postComment = (req,res,next) => {
  return CommentPost(req.body,req.params)
  .then((result)=>{
    res.status(201).send(result)
  })
  .catch((err)=>{
    next(err)
  })
}

exports.patchArticle = (req,res,next) =>{
  return updateArticle(req.body,req.params)
  .then((data)=>{
    res.status(200).send(data)
  })
  .catch((err)=>{
    next(err)
  })
}

exports.deleteComment = (req,res,next) =>{
  return deleteComment(req.params)
  .then((result)=>{
    res.status(204).send(result)
  })
  .catch((err)=>{
    next(err)
  })
}

exports.selectAllUsers = (req,res,next) => {
  return getAllUsers()
  .then((data)=>{
    res.status(200).send(data)
  })
  .catch((err)=>{
    next(err)
  })
}
