const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");

const app=express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const fName=req.body.fname;
    const lName=req.body.lname;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address:email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    };

    const jsonData=JSON.stringify(data);

    
    const url="https://us6.api.mailchimp.com/3.0/lists/898d6b6210";

    const options={
        method: "POST",
        //API Key - mailchimp
        auth: "saran:apiKey"
    };

    const request=https.request(url,options,function(response){
        const code=response.statusCode;
        if(code===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
            console.log(response.statusCode);
        })

    })

    request.write(jsonData);
    request.end();

});

app.listen(3000,function(){
    console.log("Check out port 3000!!");
});

