module.exports = {
    user:{
        phoneNum:{type:Number,required:true},
        password:{type:String,required:true},
        idNum:{type:String,required:true},
        admin:{type:Boolean},
        email:{type:String},
        trueName:{type:String},
    },
    museum:{
        name:{type:String,required:true},
        price:{type:Number,required:true},
        imgSrc:{type:String,required:true}
    }
};