const Cryptr = require('cryptr');
const cryptr = new Cryptr('PMS_Password_SECRET_KEY');
let password = body.profilePassword;
const encryptedPassword = cryptr.encrypt(password);
const decryptedPassword = cryptr.decrypt(encryptedPassword);

//console.log(encryptedPassword);
//console.log(decryptedPassword);