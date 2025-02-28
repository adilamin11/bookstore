const mangoose = require("mongoose")

const user = new mangoose.Schema({
    username :{
        type:String,
        required:true,
        unique:true,
    },
    email :{
        type:String,
        required:true,
        unique:true,
    },
    password :{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    default:"https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"],
    },
    favourites:[{type:mangoose.Types.ObjectId,
        ref:"books",
    },
],
cart:[{type:mangoose.Types.ObjectId,
    ref:"books",
},
],
orders:[{type:mangoose.Types.ObjectId,
    ref:"order",
},
],

},
{timestamps:true}
);
module.exports = mangoose.model("user",user);