$(document).ready(function () {
  app.initialized()
    .then(function (_client) {
      var client = _client;
      client.events.on('app.activated',
        function () {
          $('#apiError').hide();
          $('#bank_loader').hide();
          $('#deptorData').empty();
          $('#bankDetails').hide();
          $('#bankData').empty();
          $('#debtor_loader').hide();
          $('#apptext').empty();
          $('#matterStatus').empty();
          $("body").css({"opacity": "0.5"});
          $('#loader').show();
          $('#empty').hide();
          client.data.get("ticket").then(function (ticketData) {
            var subjectString = ticketData.ticket.subject.split(/\W+/);
            var descriptionString = ticketData.ticket.description_text.split(/\W+/);
            var matterId = [];
            subjectString.map(function (string) {
              if (string.toString().length == 8) {
                var number = string.replace(/[^0-9]/g, '');
                if (number.toString().length > 3) {
                  matterId.push(string);
                }
              }
            })
            descriptionString.map(function (string) {
              
              if (string.toString().length == 8) {
                
                var number = string.replace(/[^0-9]/g, '');
                
                if (number.toString().length > 3) {
                  matterId.push(string);
                }
              }
            })
            if (matterId.length == 0) {
              $('#loader').hide();
              $('#appData').hide();
              $('#deptorDetails').hide();
              $('#bankDetails').hide();
              $('#matterBox').show();
              $('#matterId').val("");
              $("body").css({"opacity": "1"});
              $('#error').empty();
              $('#error').append(`<p>Matter ID not found in the Ticket.<br>Please enter it manually.</p>`);
            } else if(matterId.length > 1) {
              $('#loader').hide();
              $('#appData').hide();
              $('#deptorDetails').hide();
              $('#bankDetails').hide();
              $('#matterBox').show();
              $('#matterId').val("");
              $("body").css({"opacity": "1"});
              $('#error').empty();
              $('#error').append(`<p>There are more than one matter ID found.<br>Please enter it manually</p>`);
            } else {
              client.instance.resize({ height: "250px" });
              // outStandingBalance(client, matterId);
              fileStatus(client, matterId);
            }
          }, function () {
            $('#loader').hide();
            $("body").css({"opacity": "1"});
            notify(client,"danger","Cannot get ticket data. Please reload the page!!");
          })
        }
      );

      $('#search').click(function () {
        var matterId = $('#matterId').val();
        if (matterId == "") {
          notify(client,"danger","Please enter Matter ID");
          $('#loader').hide();
          $("body").css({"opacity": "1"});
        } else if(matterId.length != 8) {
        	notify(client,"danger","Please enter a valid Matter ID..!!");
        } else {
          $('#empty').hide();
          $('#matterBox').hide();
          $('#loader').show();
          $("body").css({"opacity": "0.5"});
          client.instance.resize({ height: "250px" });
          // outStandingBalance(client, [matterId]);
          fileStatus(client, [matterId]);
        }
      })
    });
});

function outStandingBalance(client, matterIdData) {
  client.iparams.get().then(
    function (iparamData) {
      console.log(iparamData);
      $.ajax({
        url: "https://excaliburapi.nudebt.co.za/Service1.svc/balanceOutstandingMatters/" + iparamData.apiKey,
        type: "POST",
        ContentType: "application/x-www-form-urlencoded",
        data: JSON.stringify([{ ID: matterIdData[0] }]),
        dataType: 'json',
        success: function (data) {
          console.log("outstanding matter",data);
          outStandingDetails(data);
          appLoadDeptor(client, matterIdData);
        },
        error: function (error) {
          console.log("Cannot get outstanding balance",error);
          $('#loader').hide();
          $("body").css({"opacity": "1"});
          notify(client,"danger","Cannot get data from Excalibur. Please check your API key ");
        }
      });
    },
    function (error) {
      console.log("Cannot get iparams data", error);
      $('#loader').hide();
      $("body").css({"opacity": "1"});
      notify(client,"danger","Cannot get API key. Please reload your page.");
    }
  );
};

function appLoadDeptor(client, matterIdData) {
  client.iparams.get().then(
    function (iparamData) {
      $.ajax({
        url: "https://excaliburapi.nudebt.co.za/Service1.svc/DebtorDetails/" + iparamData.apiKey,
        type: "POST",
        ContentType: "application/x-www-form-urlencoded",
        data: JSON.stringify([{ D_MatterID: matterIdData[0] }]),
        dataType: 'json',
        success: function (data) {
          console.log("debtor details" ,data);
          debtorDetails(data);
          appLoadBank(client, matterIdData);
          $('#debtor_loader').hide();
          $('#bank_loader').show();
        },
        error: function (error) {
          console.log("Cannot get debtor details",error);
          $('#loader').hide();
          $("body").css({"opacity": "1"});
          notify(client,"danger","Cannot get debtor details");
        }
      });
    },
    function (error) {
      console.log("Cannot get iparams data", error);
      $('#loader').hide();
      $("body").css({"opacity": "1"});
      notify(client,"danger","Cannot get API key. Please reload your page.");
    }
  );
};

function appLoadBank(client, matterIdData) {
  client.iparams.get().then(
    function (iparamData) {
      $.ajax({
        url: "https://excaliburapi.nudebt.co.za/Service1.svc/DebtorBankDetails/" + iparamData.apiKey,
        type: "POST",
        ContentType: "application/x-www-form-urlencoded",
        data: JSON.stringify([{ MatterID: matterIdData[0] }]),
        dataType: 'json',
        success: function (data) {
          console.log("debtor bank details" ,data);
          $('#bank_loader').hide();
          deptorBankDetails(data);
        },
        error: function (error) {
          console.log("Cannot get debtor bank details",error);
          $('#loader').hide();
          notify(client,"danger","Cannot get debtor bank details");
        }
      });
    },
    function (error) {
      console.log("Cannot get iparams data", error);
      $('#loader').hide();
      $("body").css({"opacity": "1"});
      notify(client,"danger","Cannot get API key. Please reload your page.");
    }
  );
};


function fileStatus(client, matterIdData) {
  client.iparams.get().then(
    function (iparamData) {
      $.ajax({
        url: "https://excaliburapi.nudebt.co.za/Service1.svc/FileStatus/"+ iparamData.apiKey,
        type: "POST",
        ContentType: "application/x-www-form-urlencoded",
        data: JSON.stringify([{ ID: matterIdData[0] }]),
        dataType: 'json',
        success: function (data) {
          console.log("file status matters" ,data);
          $('#debtor_loader').show();
          matterStatus(data,matterIdData[0]);
          outStandingBalance(client, matterIdData);
        },
        error: function (error) {
          console.log("Cannot get file status matters", error);
          $('#loader').hide();
          $("body").css({"opacity": "1"});
          $('#apiError').show();
          notify(client,"danger","Cannot get file status matters");
        }
      });
    },
    function (error) {
      console.log("Cannot get iparams data", error);
      $('#loader').hide();
      $("body").css({"opacity": "1"});
      notify(client,"danger","Cannot get API key. Please reload your page.");
    }
  );
};


function debtorDetails(debtorData) {
  $('#deptorDetails').show();
  $('#deptorData').empty();
  $('#deptorData').append(` <h5><b>Debtor Details :</b></h5>`);
  var debtorDetail = debtorData.DebtorDetails;
  if(debtorDetail.length != 0) {
    debtorDetail.map(function (data) {
      
      if(data.D_Title != "") {
        $('#deptorData').append(`<label>Title : <b>` + data.D_Title + `</b></label>`);
      } else {
        $('#deptorData').append(`<label>Title : <b> - </b></label>`);
      }
      
      if(data.D_Initials != "") {
        $('#deptorData').append(`<label>Initials : <b>` + data.D_Initials + `</b></label>`);
      } else {
        $('#deptorData').append(`<label>Initials : <b> - </b></label>`);
      }
      
      if(data.D_FullNames != "") {
        $('#deptorData').append(`<label>Fullname : <b>` + data.D_FullNames + `</b></label>`);
      } else {
        $('#deptorData').append(`<label>Fullname : <b> - </b></label>`);
      }
      
      if(data.D_Surname != "") {
        $('#deptorData').append(`<label>Surname : <b>` + data.D_Surname + `</b></label>`);
      } else {
        $('#deptorData').append(`<label>Surname : <b> - </b></label>`);
      }
      
      if(data.ID != "") {
        $('#deptorData').append(`<label>ID number : <b>` + data.ID + `</b></label>`);
      } else {
        $('#deptorData').append(`<label>ID number : <b> - </b></label>`);
      }

      if(data.D_L_LangID != "") {
        $('#deptorData').append(`<label>Language ID : <b>` + data.D_L_LangID + `</b></label>`);
      } else {
        $('#deptorData').append(`<label>Language ID : <b> - </b></label>`);        
      }
      
      if(data.PN_Number_C == "") {
        $('#deptorData').append(`<label>Phone 1 : <b> - </b></label>`);
      } else {
        $('#deptorData').append(`<label>Phone 1 : <b>` + data.PN_Number_C + `</b></label>`);
      }

      if(data.PN_Number_H2 == "") {
        $('#deptorData').append(`<label>Phone 2 : <b> - </b></label>`);
      } else {
        $('#deptorData').append(`<label>Phone 2 : <b>` + data.PN_Number_H2 + `</b></label>`);
      }

      if(data.D_CellNo != "") {
        $('#deptorData').append(`<label>Mobile : <b>` + data.D_CellNo + `</b></label>`);
      } else {
        $('#deptorData').append(`<label>Mobile : <b> - </b></label>`);
      }
      
      if(data.PN_Number_F != "") {
        $('#deptorData').append(`<label>Fax : <b>`+ data.PN_Number_F +`</b></label>`);
      } else {
        $('#deptorData').append(`<label>Fax : <b> - </b></label>`);
      }
      
      if(data.PN_Number_W != "") {
        $('#deptorData').append(`<label>Direct work Tel : <b>`+ data.PN_Number_W +`</b></label>`);
      } else {
        $('#deptorData').append(`<label>Direct work Tel : <b> - </b></label>`);
      }
      
      if(data.DE_EMailX1 != "") {
        $('#deptorData').append(`<label>Email : <b>` + data.DE_EMailX1 + `</b></label>`);
      } else {
        $('#deptorData').append(`<label>Email : <b> - </b></label>`);
      }
      
      if(data.D_Department  != "") {
        $('#deptorData').append(`<label>Employer : <b>`+ data.D_Department +`</b></label><br>`);
      } else {
        $('#deptorData').append(`<label>Employer : <b> - </b></label><br>`);
      }
    })
  } else {
    $('#loader').hide();
    $("body").css({"opacity": "1"});
    $('#deptorData').append(`<label>Title : <b> - </b></label>`);
    $('#deptorData').append(`<label>Initials : <b> - </b></label>`);
    $('#deptorData').append(`<label>Fullname : <b> - </b></label>`);
    $('#deptorData').append(`<label>Surname : <b> - </b></label>`);
    $('#deptorData').append(`<label>ID number : <b> - </b></label>`);
    $('#deptorData').append(`<label>Language ID : <b> - </b></label>`);
    $('#deptorData').append(`<label>Phone 1 : <b> - </b></label>`);
    $('#deptorData').append(`<label>Phone 2 : <b> - </b></label>`);
    $('#deptorData').append(`<label>Mobile : <b> - </b></label>`);
    $('#deptorData').append(`<label>Fax : <b> - </b></label>`);
    $('#deptorData').append(`<label>Direct work Tel : <b> - </b></label>`);
    $('#deptorData').append(`<label>Email : <b> - </b></label>`);
    $('#deptorData').append(`<label>Employer : <b> - </b></label><br>`);
  }
};

function deptorBankDetails(bankData) {
  var deptorBankData = bankData.DebtorBankDetails;
  $('#matterBox').hide();
  $('#bankDetails').show();
  $('#bankData').show();
  $('#bankData').empty();
  $('#bankData').append(`<h5><b>Debtor Bank Details :</b></h5>`);
  if(deptorBankData.length != 0) {
    deptorBankData.map(function (data) {
	    if(data.BankAccHolder != "") {
	        $('#bankData').append(`<label>Bank account holder : <b>` + data.BankAccHolder + `</b></label>`);
	    } else {
	        $('#bankData').append(`<label>Bank account holder : <b> - </b></label>`);
	    }
	    if(data.BankInstitution != "") {
	        $('#bankData').append(`<label>Institution : <b>` + data.BankInstitution + `</b></label>`);
	    } else {
	        $('#bankData').append(`<label>Institution : <b> - </b></label>`);
	    }
	    if(data.BankBranch != "") {
	        $('#bankData').append(`<label>Branch code : <b>` + data.BankBranch + `</b></label>`);
	    } else {
	        $('#bankData').append(`<label>Branch code : <b> - </b></label>`);
	    }
	    if(data.BankAccount != "") {
	     	$('#bankData').append(`<label>Account number : <b> ******` + data.BankAccount.substr(-4,4) + `</b></label>`);
	    } else {
	        $('#bankData').append(`<label>Account number : <b> - </b></label>`);
	    }
	    if(data.BankType != "") {
	        $('#bankData').append(`<label>Account type : <b>` + data.BankType + `</b></label>`);
	    } else {
	        $('#bankData').append(`<label>Account type : <b> - </b></label>`);
	    }
    })
  } else {
    $('#loader').hide();
    $("body").css({"opacity": "1"});
    $('#bankData').append(`<label>Bank account holder : <b> - </b></label>`);
    $('#bankData').append(`<label>Institution : <b> - </b></label>`);
    $('#bankData').append(`<label>Branch code : <b> - </b></label>`);
    $('#bankData').append(`<label>Account number : <b> - </b></label>`);
    $('#bankData').append(`<label>Account type : <b> - </b></label>`);
  }
};

function outStandingDetails(outStandingData) {
  $('#appData').show();
  var outStanding = outStandingData.BalanceOutstanding;
  if(outStanding.length != 0) {
    outStanding.map(function(data) {
      $('#apptext').empty();
      if(data.M_CurBalanceOutstanding != "") {
        $('#apptext').append(`<label>Outstanding balance : <b>`+ data.M_CurBalanceOutstanding +`</b> </label><br>`);
      } else {
        $('#apptext').append(`<label>Outstanding balance : <b> - </b> </label><br>`);
      }
    })
  } else {
    $('#loader').hide();
    $("body").css({"opacity": "1"});
    $('#apptext').empty();
    $('#apptext').append(`<label>Outstanding balance : <b> - </b> </label><br>`);
  }
};

function matterStatus(matterData,matterId) {
  $('#loader').hide();
  $("body").css({"opacity": "1"});
	var matterStatus = matterData.FileStatus;
	if(matterStatus.length != 0) {
		$('#matterStatus').empty();
    $('#matterStatus').append(`<label>Matter ID : <b>`+ matterId +`</b> </label>`);
		matterStatus.map(function(matter) {
			$('#matterStatus').append(`<label>Matter status : <b> `+ matter.St_Status +` </b> </label>`);
		})
	} else {
    $('#matterStatus').append(`<label>Matter ID : <b> `+ matterId + ` </b> </label>`);
		$('#matterStatus').append(`<label>Matter status : <b> - </b> </label><br>`);
	}
}


function notify(client,notifyType,notifyMessage) {
  client.interface.trigger("showNotify", {
    type: notifyType,
    message: notifyMessage
  });
};
