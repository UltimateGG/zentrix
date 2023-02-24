const key = process.env.TOKEN_ENCRYPTION_KEY || 'tkn';


const encryptToken = (str) => {
  let hexString = '';
  for (let i = 0; i < str.length; i++)
    hexString += str.charCodeAt(i).toString(16);

  let encrypted = '';
  for (let i = 0; i < hexString.length; i++) {
    let keyChar = key.charCodeAt(i % key.length);
    let hexChar = parseInt(hexString.charAt(i), 16);
    let encryptedChar = keyChar ^ hexChar;
    encrypted += String.fromCharCode(encryptedChar);
  }

  return Buffer.from(encrypted).toString('base64');
}

const decryptToken = (str) => {
  str = Buffer.from(str, 'base64').toString('ascii');

  let decrypted = '';
  for (let i = 0; i < str.length; i++) {
    let keyChar = key.charCodeAt(i % key.length);
    let encryptedChar = str.charCodeAt(i);
    let decryptedChar = keyChar ^ encryptedChar;
    decrypted += String.fromCharCode(decryptedChar);
  }

  let hexString = '';
  for (let i = 0; i < decrypted.length; i++)
    hexString += decrypted.charCodeAt(i).toString(16);

  let result = '';
  for (let i = 0; i < hexString.length; i += 2)
    result += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));

  return result;
}


module.exports = {
  encryptToken,
  decryptToken
};
