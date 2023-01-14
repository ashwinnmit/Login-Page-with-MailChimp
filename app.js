const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



app.get("/",function(req,res){
    res.sendFile(__dirname + "/SignUp_Offl.html");
})


app.post("/", function(req,res){
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;
    // format required by MailChimp Api
    var data = {
        members : [
            {
                email_address : email,
                status:"subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);
    const url = "https://us11.api.mailchimp.com/3.0/lists/0904e5c2a0";
    // see and undertand options properly 
    const options = {
        method : "POST",
        auth : "Ashwin:api-key",
    }
    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })
    request.write(jsonData);
    request.end();
});


app.post("/failure",function(req,res){
    res.redirect("/");
})
//Heroku stuff below
app.listen(process.env.PORT || 3000,function(req,res){
    
})


