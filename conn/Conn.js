const mangoose = require("mongoose")

const Conn = async()=>{
    try {
        await mangoose.connect(`${process.env.URI} `)
        console.log("connected to database");
        

    } catch (error) {
        console.log(error);
        
    }
}
Conn()