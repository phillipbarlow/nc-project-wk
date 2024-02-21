const { getTopics, getArticle } = require("./model");
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
