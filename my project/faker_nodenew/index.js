var faker = require('faker');
var express = require('express')
var path =require('path');
var app = express()
 
app.get('/', function (req, res) {
  res.sendFile('index.html',{root: path.join(__dirname, './files')});

})
for(i=0;i<=10;i++){
  var firstName = faker.name.firstName();
   var lastName = faker.name.lastName();
   var phoneNumber =faker.phone.phoneNumber();
   var email = faker.internet.email(firstName, lastName);
  console.log("fName: ",firstName,"lname:",lastName,"Phonenumber: ",phoneNumber,"Email: ",email);
  }
app.listen(3000,function(){
    console.log("app running on http://localhost:3000/")
   })











