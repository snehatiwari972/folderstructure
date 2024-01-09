const express = require('express');
const app = express();
const userRouter = require('../routes/userRoutes');
const noteRouter = require('../routes/noteRoutes');


app.use(express.json());  // ye bhi ek middleware ki tarah work krta hai, req ki jo body hoti hai usko JSON me convert krta hai or next step pr usko bhej deta hai
// HTTP method ko check krne ke liye use kiya tha
// app.use((req, res, next)=>{
//     console.log("HTTP Method - " + req.method + " , URL - " + req.url);
//     next();
// });

app.use("/users", userRouter);
app.use("/note", noteRouter);




app.use((req, res)=>{
    res.status(404).json({
        error: 'Wrong request'
    });
});


app.listen(5000,(req,res)=>{
console.log("Server Started on port no. 5000");
});