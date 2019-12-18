

//const http = require("http");
const request = require("request");
const express = require("express");
const app = express();
const port = 8001;
//const path = require("path");
//const router = express.Router();

app.post("/", (req, res) => {
  req.on("data", function(chunk) {
    var strinfydata = chunk.toString();
    var Data = JSON.parse(strinfydata);
    console.log("data",Data);
    var freshdesk_sub = Data.freshdesk_webhook.ticket_subject;

    var freshdesk = Data.freshdesk_webhook;

    console.log("Data:", freshdesk_sub);
    var n = freshdesk_sub.indexOf("@");
    var w = freshdesk_sub.indexOf("#");
  var res = freshdesk_sub.slice(n+1, w);
  var res1 = freshdesk_sub.slice(w+1,);
    const options = {
      url: "https://gitlab.com/api/v4/projects/"+ res +"/issues/"+  res1+"/discussions/",

      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer mbLadtNSBvECatbcBJSe"
      },
      body: JSON.stringify({
        body:  freshdesk.ticket_description
      })
    };

    request(options, function(err, res, body) {
      let json = JSON.parse(body);
      console.log(json);
    });
  });

  res.end();
});

// app.get("/gitlap", (req, res) => {
//     res.send(data);
//   });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));








// const request = require('request');

// const options = {
//     url: 'https://spritlesoftware.freshdesk.com/api/v2/tickets/',
//     method: 'POST',
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": "basic  ekh1S2RUdUp0M3hjdTJvcEVXdQ=="

//     },body: JSON.stringify({
//             description: "Details about the issue...",
//             subject: "..sp2checking.",
//             email: "sp2@outerspace.com",
//             priority: 1,
//             status: 2,
//             cc_emails: ["ram@freshdesk.com", "diana@freshdesk.com"]
//           })
// };

// request(options, function(err, res, body) {
//     let json = JSON.parse(body);
//     console.log(json);
// });
