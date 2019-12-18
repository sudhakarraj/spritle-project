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
                    var convUrl = "https://" + domainName + "/api/v2/tickets/" ;
                    var convOptions = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': '<%= encode(iparam.apikey) %>'
                        },


                       body: JSON.stringify({ 
                           "description": "Details about the issue...", 
                           "subject": "..sp2checking.", "email": "sp2@outerspace.com",
                            "priority": 1, "status": 2,
                             "cc_emails": ["ram@freshdesk.com","diana@freshdesk.com"]
                             })
                        

                    };
                    client.request.post(convUrl, convOptions).then(function(conversationsData) {
                     $('.loading').hide();
                      
                            
                      console.log("respopnse:",conversationsData.response);

                        
                        
                    })
                })
            })
        })
    })
})
