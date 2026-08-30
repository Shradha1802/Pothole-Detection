const app= require("./src/app.js")
const env=require("dotenv").config();

const connectDB=require("./src/db/database.js");

connectDB();

app.listen(8080,()=>{
    console.log("listening on 8080");
})