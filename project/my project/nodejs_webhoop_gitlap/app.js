const request = require("request");
const express = require("express");
const app = express();
const port = 8000;

app.post("/", (req, res) => {
  res.end();
});
app.post("/gitlabreceive", (req, res) => {
  req.on("data", function(chunk) {
    var strinfydata = chunk.toString();
    var Data = JSON.parse(strinfydata);

    var name = Data.user.username;
    var projectname = Data.project.name;
    var projectid = Data.project.id;

    var issuesiid = Data.object_attributes.iid;
    var title = Data.object_attributes.title;
    var description = Data.object_attributes.description;
    var action = Data.object_attributes.action;
    var ticketdata = "~~~" + projectid + "!!!" + issuesiid;

    //console.log(action);
    console.log("ticketdata:", ticketdata);

    if (action == "open" || action == "update") {
      const options = {
        url: "https://spritlesoftware.freshdesk.com/api/v2/tickets/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "basic  ekh1S2RUdUp0M3hjdTJvcEVXdQ=="
        },
        body: JSON.stringify({
          description:
            description + "<div style='display:none;'>" + ticketdata + "</div>",
          subject: title,
          email: projectname + "@gmail.com",
          priority: 1,
          status: 2,
          cc_emails: [projectname + "@gmail.com", name + "@gmail.com"]
        })
      };

      request(options, function(err, res, body) {
        let json = JSON.parse(body);
        console.log("descrption_text:", json.description_text);
        // console.log("descrption<div>:",json.description);
      });
    }
  });

  res.end();
});
app.post("/freshdeskreceive", (req, res) => {
  req.on("data", function(chunk) {
    var strinfydata = chunk.toString();
    var Data = JSON.parse(strinfydata);
    //console.log("data", Data);
    var ticket_description0 = Data.freshdesk_webhook.ticket_description;
    var ticket_description1 = ticket_description0.replace("</div>", "");
    var ticket_description = ticket_description1.replace("</div>", "");
    //console.log("ticket_description:", ticket_description);
    var freshdesk = Data.freshdesk_webhook;
    var n = ticket_description.indexOf("~~~");
    var w = ticket_description.indexOf("!!!");
    var pid = ticket_description.slice(n + 3, w);
    var iiid = ticket_description.slice(w + 3);
   // console.log("freshdesk:", freshdesk.ticket_latest_public_comment);

    console.log("pid:", pid);
    console.log("iiid:", iiid);
    const options = {
      url:
        "https://gitlab.com/api/v4/projects/" +
        pid +
        "/issues/" +
        iiid +
        "/discussions/",

      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer mbLadtNSBvECatbcBJSe"
      },
      body: JSON.stringify({
        body: freshdesk.ticket_latest_public_comment
      })
    };

    request(options, function(err, res, body) {
      let json = JSON.parse(body);
      console.log(json.id);
    });
  });

  res.end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
