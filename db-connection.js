const mongoose = require('mongoose')
let uri = "mongodb+srv://usr-fccMongoDB:"+process.env.MONGO_PASS+"@fccmongodb.ywcwgtz.mongodb.net/?retryWrites=true&w=majority"
const db =  mongoose.connect(uri,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
module.exports = db