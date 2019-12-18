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
        },
        function(error) {
          $("#lead_create_status").text(
            "Error occurred when fetching Freshdesk Contact -" + error.message
          );
        }
      );
          $("#submitcontact").click(function() {
            
            var contactname = $("#name").val();
  var contactemail = $("#email").val();
  var contactphone_number = $("#phone_number").val();
  $("#myForm").validate({
    rules: {
      name: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      phone_number: {
        required: true,
        maxlength: 10,
        minlength:10,
        number: true
      }
    },

    messages: {
      name: {
        required: " Enter your Contact Name."
      },
      email: {
        required: " Enter your  Email.",
        email: " Enter a valid email address."
      },
      phone_number: {
        required: " Enter your  probability",
        maxlength: " Enter a valid mobile number.",
        minlength: " Enter a valid mobile number.",
        number: "Enter a valid mobile number."
      }
    },
    onfocusout: function(element) {
      this.element(element);
    },
    submitHandler: function() {
      createContact(contactname,contactemail,contactphone_number);
    }
  });

 });


 function createContact(contactname,contactemail,contactphone_number){
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
   },
    function(error) {
      $("#lead_create_status").text(
        "Error occurred when fetching Freshdesk Contact -" + error.message
      );
    }
  );

  
  
});
