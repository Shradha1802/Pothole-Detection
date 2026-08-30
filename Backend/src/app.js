const express=require("express");
const cors=require("cors");
const app=express();
const cookie=require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookie())

const eventRoutes=require("./routes/event.routes");
app.use("/api/events",eventRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
module.exports=app;