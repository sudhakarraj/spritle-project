$(document).ready(function() {
    app.initialized().then(function(client) {
        client.events.on('app.activated', function() {
            $('.loading').show();
            $('#download').hide();
            $('#download').off('click');
            client.data.get('ticket').then(function(ticketData) {
                //var ticketId = ticketData.ticket.id;


                

                   
                    
                
      
                  
                 
                client.data.get('domainName').then(function(domainData) {
                    var domainName = domainData.domainName;


                    for(i=0;i<=10;i++){
                       
                        var firstName = faker.name.firstName();
                        var lastName = faker.name.lastName();
                        var phoneNumber =faker.phone.phoneNumber();
                        var email = faker.internet.email(firstName, lastName);
                      
                     
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
                     $('.loading').hide();
                      console.log("respopnse");
                   })
                }


                })
            })
        })
    })
})
