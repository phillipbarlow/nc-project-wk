const {getTopics} = require('./model')
const endPoints = require('./endpoints.json')
exports.selectTopics = (req,res)=>{
    return getTopics()
    .then((result)=>{
        res.status(200).send(result);
    })
}

exports.getEndpoints = (req,res)=>{
    res.status(200).send(endPoints)
}