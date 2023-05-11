const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");


mailchimp.setConfig({
  apiKey: "8817202022a518c7d887d4a9231ae86e-us21",
  server: "us21"
});

//Function run which check conecction to API

// async function run(){
//   const response = await mailchimp.ping.get();
//   console.log(response);
// };
// run();


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {
  var fName = req.body.firstName;
  var lName = req.body.lastName;
  var email = req.body.email;
  const listID = "80e2cfa9d5";

  // Hold data from HTML form

  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: email,
  };

  // Function which add contact to our email list in Mailchimp. If everythink is OK return message in console

  async function addToList() {
    const response = await mailchimp.lists.addListMember(listID, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    
    if (response.status == 'subscribed'){
      res.sendFile(__dirname + '/success.html');
    }else{
      res.sendFile(__dirname + '/failure.html');
    }

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
        response.id
      }.`

    );
  };

  addToList()

}); 

 
app.post("/failure", function(req, res){
  res.redirect("/");
});
  
 
app.listen(3000, function() {
  console.log("Server is running on port 3000");

});
