$(document).ready(function() {
    app.initialized().then(function(client) {
      client.events.on('app.activated', function() {
      function generateName (i) {

        // make name contextual to username and email
        var firstName = faker.name.firstName();
         var lastName = faker.name.lastName();
         var phoneNumber =faker.phone.phoneNumber();
         var email = faker.internet.email(firstName, lastName);
          //console.log("Name: ",firstName,"Phonenumber: ",phoneNumber,"Email: ",email);
           
          
          var domainName="spritlesoftware.freshdesk.com";
          var convUrl = "https://" + domainName + "/api/v2/tickets/" ;
          var convOptions = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': '<%= encode(iparam.apikey) %>'
              },
               body: JSON.stringify({ 
                 "description": "Details about the issue...", 
                 "subject": firstName+"Support needed..."+phoneNumber, "email": email,
                  "priority": 1, "status": 2,
                   "cc_emails": [ lastName+"@gmail.com", firstName+"@gmail.com"]
                   })
              };
          client.request.post(convUrl, convOptions).then(function(conversationsData) {
            
               console.log("success");
             })
             
      };

     $('#generateName').click(function(){
        for (i = 1; i <=5; i++) {
       generateName(i);
            //    if(i>4998){
            // $('#loading').show();
            //       }
            //  if(i==4999)
            //    {
            //     $('#loading').hide();
            //     }
            }
         });
    })
  })
})

















    
