var btoa = require("btoa");
exports = {
  events: [
    { event: "onConversationCreate", callback: "onConversationCreateCallback" }
  ],
  onConversationCreateCallback: function(payloads) {
    let subdomain = payloads.iparams.subdomain;
    let apikey = payloads.iparams.api;
    let ticketId = payloads.data.conversation.ticket_id;
    let semail = payloads.data.conversation.support_email;
    let bodyt = payloads.data.conversation.body_text;
    let ccemail = payloads.data.conversation.cc_emails;

    console.log("data:", subdomain, apikey, ticketId, semail, bodyt, ccemail);

    let url = `https://${subdomain}.freshdesk.com/api/v2/tickets/${ticketId}`;
    let options = {
      headers: {
        Authorization: `Basic ${btoa(apikey)}`,
        "Content-Type": "application/json"
      }
    };

    $request.get(url, options).then(
      function(data) {
        let responseData = JSON.parse(data.response);
        console.log("responseData:", responseData.product_id);
        if (responseData.product_id == 26000000633) {
          addTag(apikey, subdomain, bodyt, semail, ccemail);
        }
      },
      function() {
        renderData({
          status: 500,
          message: "Error while processing the request"
        });
      }
    );
  }
};
function addTag(apikey, subdomain, bodyt, semail, ccemail) {
  let url = `https://${subdomain}.freshdesk.com/api/v2/tickets/`;
  let options = {
    headers: {
      Authorization: `Basic ${btoa(apikey)}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      description: "Details about the issue...",
      subject: bodyt,
      email: semail,
      priority: 1,
      status: 2,
      cc_emails: [ccemail[0], ccemail[1]]
    })
  };

  $request.post(url, options).then(
    function() {
      renderData(null, { message: "Ticket Create successfully!" });
      
    },
    function() {
      renderData({
        status: 500,
        message: "Error while processing the request"
      });
    }
  );
}
