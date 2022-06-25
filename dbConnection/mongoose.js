const mongoose=require('mongoose')


mongoose.connect('mongodb+srv://Dharmendra:dkyadav123@cluster0.kq9bu.mongodb.net/Dk-Project-1',{
    useNewUrlParser:true

})  
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err))
