$(document).ready(function() {
  app.initialized().then(
    function(_client) {
      var client = _client;
      client.events.on("app.activated", function() {
        client.data.get("contact").then(
          function(data) {
            //console.log("Contact email:", data.contact.email);
            var email = data.contact.email;
            contact(email);
          },
          function(error) {
            $("#Contact_create").text(
              "Error occurred when fetching Freshdesk Contact -" + error.message
            );
          }
        );
        function contact(email) {
          //end contact getdata
          var url =
            "https://spritle.agilecrm.com/dev/api/contacts/search/email/" +
            email;

          https: var options = {
            headers: {
              Authorization:
                "Basic ZmRtYXJrZXRwbGFjZXN1cHBvcnRAc3ByaXRsZS5jb206MDA3N0BzcFNQ",
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          };
          client.request.get(url, options).then(
            function(success) {
              // console.log("status:",success.status);

              var status = success.status;

              if (status == 204) {
                // console.log("contact not available");
                $("#crateaccount").show();
              } else {
                var data = JSON.parse(success.response);
                var contactp = data.properties;
                var id = data.id;

                //console.log("sucesschecking:",contactp);
                $("#contactshow").show();
                $("#contacti").show();
                
                var newContact = `<p id='contact-title'>Name</p><strong><p>${contactp[0].value} <span><i class="fa fa-share-square-o"></i></span> 
                  </strong></p><p id='contact-title'>Email</p><strong><p>${contactp[1].value} <span><i class="fa fa-share-square-o"></i></span>
                  </strong></p><p id='contact-title'>Expected value</p><strong><p> ${contactp[2].value}<span><i class="fa fa-share-square-o"></i></span>
                  </strong></p><div class='fw-divider'></div>`;

                $("#contactd").append(newContact);
                $("#dealsi").show();

                deals(id);
              }
            },
            function(error) {
              $("agilecrmcontact").text(
                "Error occurred agile_crm contact -" + error.message
              );
            }
          );
        }
        function deals(id) {
          var url =
            "https://spritle.agilecrm.com/dev/api/contacts/" + id + "/deals";

          https: var options = {
            headers: {
              Authorization:
                "Basic ZmRtYXJrZXRwbGFjZXN1cHBvcnRAc3ByaXRsZS5jb206MDA3N0BzcFNQ",
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          };
          client.request.get(url, options).then(
            function(success) {
              //console.log("checkingrequest:",success.response);
              var responsedeals = JSON.parse(success.response);

              if (responsedeals.length == 0) {
                $("#dealsdetails").show();

                $("#createdealmodal").show();
              } else if (responsedeals.length >= 1) {
                var data = JSON.parse(success.response);

                data.forEach(myFunction);
                function myFunction(element) {
                  var newDeals = `<p id='contact-title'>Name</p><strong><p>
                   ${element.name}<span><i class="fa fa-share-square-o"></i></span>
                    </strong></p><p id='contact-title'>Expected value</p><strong><p>
                    ${element.expected_value}<span><i class="fa fa-share-square-o"></i></span>
                    </strong></p><div class='fw-divider'></div>`;
                  $("#deald").append(newDeals);
                }
               

                $("#createdealmodal").show();
              }
            },
            function(error) {
              $("#dealsgeted").text(
                "Error occurred dealsGet -" + error.message
              );
            }
          );
        }
        $("#createdealmodal").click(function() {
          client.interface.trigger("showModal", {
            title: "Create Deal",
            template: "deal/createdeal.html"
          });
        });

        $("#createcontactmodal").click(function() {
          client.interface.trigger("showModal", {
            title: "Create Contact",
            template: "modal/modal.html"
          });
        });
      });
    },
    function(error) {
      $("#appactivated").text("Error occurred appactivated -" + error.message);
    }
  );
});
