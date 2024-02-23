const { getTopics, getArticle, getArticlesCount, getAllComments } = require("./model");
const endPoints = require("./endpoints.json");
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
  return getArticlesCount()
  .then((result)=>{
    res.status(200).send(result)
  })
}

exports.selectAllComments = (req,res,next) =>{
    return getAllComments(req.params)
    .then((result)=>{
      // console.log(result.body)
      res.status(200).send(result);
    }).catch((err)=>{
      next(err)
    })
}