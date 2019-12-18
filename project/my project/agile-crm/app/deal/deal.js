$(document).ready(function() {
  app.initialized().then(
    function(_client) {
      var client = _client;

      client.data.get("contact").then(
        function(success) {
          var email = success.contact.email;
          //#start region   create contact
          $("#deal_submit").click(function() {
            var dealname = $("#name").val();
            var dealexpected_value = $("#expected_value").val();
            var dealprobability = $("#probability").val();
            var dealmilestone = "Proposal";
            $("#myForm").validate({
              rules: {
                name: {
                  required: true
                },
                expected_value: {
                  required: true,
                  number: true
                },
                probability: {
                  required: true,
                  maxlength: 2,
                  number: true
                }
              },

              messages: {
                name: {
                  required: " Enter your Deals name"
                },
                expected_value: {
                  required: " Enter your  amount",
                  number: "enter number only"
                },
                probability: {
                  required: " Enter your  probability",
                  maxlength: " Enter max two number",
                  number: "enter number only"
                }
              },
              onfocusout: function(element) {
                this.element(element);
              },
              submitHandler: function() {
                dealCreate();
              }
            });

            //create deal
            function dealCreate() {
              var url =
                "https://spritle.agilecrm.com/dev/api/opportunity/email/" +
                email;

              https: var options = {
                headers: {
                  Authorization:
                    "Basic ZmRtYXJrZXRwbGFjZXN1cHBvcnRAc3ByaXRsZS5jb206MDA3N0BzcFNQ",
                  "Content-Type": "application/json",
                  Accept: "application/json"
                },
                data: {},
                json: {
                  name: dealname,
                  expected_value: dealexpected_value,
                  probability: dealprobability,
                  milestone: dealmilestone
                }
              };
              client.request.post(url, options).then(
                function(success) {
                  var status = success.status;
                  if (status == 200) {
                    $("#deal_create_success").show();
                    $("#deal_create_form").hide();
                  } else {
                    var newDeal = "<p> some error Created Deal </p>";
                    $("#dealsnotify").append(newDeal);
                  }
                },
                function(error) {
                  console.log("error", error);
                  $("#deal_create_status").text(
                    "Error occurred post deals -" + error.message
                  );
                }
              );
            }
            /// create deal
          });
        },
        function(error) {
          $("#deal_create_status").text(
            "Error occurred when fetching Freshdesk Contact -" + error.message
          );
        }
      );
    },
    function(error) {
      $("#deal_create_status").text(
        "Error occurred when fetching Freshdesk Contact -" + error.message
      );
    }
  );
});
