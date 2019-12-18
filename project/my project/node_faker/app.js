var faker = require('faker');

for(i=0;i<=10;i++){
// var randomName = faker.name.findName(); // Rowan Nikolaus
//  var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
// var randomCard = faker.helpers.createCard(); // random contact card containing many properties



 var firstName = faker.name.firstName();
 var lastName = faker.name.lastName();
 var phoneNumber =faker.phone.phoneNumber();
 var email = faker.internet.email(firstName, lastName);
//console.log("details",randomName,randomEmail);
  console.log("fName: ",firstName,"lname:",lastName,"Phonenumber: ",phoneNumber,"Email: ",email);
//console.log("details",randomCard);

}