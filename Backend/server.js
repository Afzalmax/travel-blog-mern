const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const path = require("path");
connectDB();
const routes = require("./routes");
app.use(express.json());
app.use("/uploads",express.static(path.join(__dirname, "uploads")));
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use("/api",routes);
app.use("/",(req,res)=>{
res.send("SERVER RUNNING ")
})
app.use(express.json());

app.listen(port, () => console.log(`Server running on port ${port}`));