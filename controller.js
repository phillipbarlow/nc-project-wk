const {getTopics} = require('./model')
exports.selectTopics = (req,res)=>{
    // return model.getTopics()
    return getTopics()
    .then((result)=>{
        res.status(200).send(result)
        return result
    })
    // .then((result)=>{
    //     console.log(result)
    // })
}