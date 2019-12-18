$(document).ready(function() {
  app.initialized().then(
    function(_client) {
      var client = _client;

      client.data.get("contact").then(
        function(success) {
          var name = success.contact.name;
          var email = success.contact.email;
          var phone = success.contact.phone;

          document.getElementById("name").value = name;
          document.getElementById("email").value = email;
          document.getElementById("phone_number").value = phone;
          
          $("#submitcontact").click(function() {
            createTicket();
          });
          
        },
        function(error) {
          $("#lead_create_status").text(
            "Error occurred when fetching Freshdesk Contact -" + error.message
          );
        }
      );
    },
    function(error) {
      $("#lead_create_status").text(
        "Error occurred when fetching Freshdesk Contact -" + error.message
      );
    }
  );
function createTicket(){
  var contactname = $("#name").val();
  var contactemail = $("#email").val();
  var contactphone_number = $("#phone_number").val();

  var url = " https://spritle.agilecrm.com/dev/api/contacts/";
  https: var options = {
    headers: {
      Authorization:
        "Basic ZmRtYXJrZXRwbGFjZXN1cHBvcnRAc3ByaXRsZS5jb206MDA3N0BzcFNQ",
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    data: {},
    json: {
      properties: [
        {
          type: "SYSTEM",
          name: "first_name",
          value: contactname
        },
        {
          type: "SYSTEM",
          name: "email",
          subtype: "work",
          value: contactemail
        },
        {
          type: "SYSTEM",
          name: "phone",
          subtype: "",
          value: contactphone_number
        }
      ]
    }
  };
  client.request.post(url, options).then(
    function(success) {
      var status = success.status;
      if (status == 200) {
        $("#create_success").show();
        $("#lead_form").hide();
      } else if (data.status == 400) {
        $("#invalid_email").show();
      }
    },
    function(error) {
      $("#lead_create_status2").text(
        "Error occurred when fetching Freshdesk Contact -" +
          error.message
      );
    }
  );
  }
});
