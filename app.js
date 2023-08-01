const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); // you need to add dependency first. See tips.

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: "7aadb4b39641d115f69a3af763a23366-us11",
  server: "us11",
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
    try {
      const response = await client.lists.addListMember("0429341468", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
    run()
  };

  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});




















// const bodyParser = require("body-parser");
//
// const express = require("express");
//
// const request = require("request");
//
// const https = require("https");
//
// const app = express();
//
// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({extended: true}));
//
// app.get("/", function(req, res){
//   res.sendFile(__dirname + "/signup.html");
// })
//
// app.post("/", function(req, res){
//   const firstName = request.body.firstName;
//   const lastName = request.body.lastName;
//   const email = request.body.email;
//
//   const data = {
//     members: [
//       {
//         email_address: email,
//         status: "subscribed",
//         merge_fields: {
//           FNAME: firstName,
//           LNAME: lastName
//         }
//       }
//     ]
//   };
//   const jsonData = JSON.stringify(data);
//
//   const url = "https://us11.api.mailchimp.com/3.0/lists/0429341468";
//
//   const options = {
//     method: "POST",
//     auth: "tommy:7aadb4b39641d115f69a3af763a23366-us11"
//   }
//
//   const requests = https.request(url, options, function(res) {
//
//     if (response.statusCode === 200){
//       res.sendFile(__dirname + "/success.html");
//     } else {
//       res.sendFile(__dirname + "/failure.html");
//     }
//
//     response.on("data", function(data){
//       console.log(JSON.parse(data));
//     })
//   })
//
//   // req.write(jsonData);
//   req.end();
//
//
// });
//
//
//
//
//
// app.listen(3000, function(){
//   console.log("Server is listening on port 3000.")
// })
//
//
// //apikey
// //7aadb4b39641d115f69a3af763a23366-us11
//
// //unique id
// //0429341468
