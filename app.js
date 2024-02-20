const express = require('express');
const app = express();
const {selectTopics,getEndpoints} = require('./controller')
app.get('/api/topics', selectTopics)
app.get('/api', getEndpoints)
app.all('/api/*',(req, res, next)=>{
    res.status(404).send({msg:"404 error"})
    next()
})

module.exports = app