
// function that finds user by email, returning the user

const getsUserByEmail = (email, users) => {
  for (let item in users) {
    if (users[item].email === email) {
      return users[item].id;
    }
  }
  return undefined;
};

// Function that generates a random string for shortening a url
const generateRandomString = () => {
  let result = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqurstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// checking if new email is already existing
const emailChecker = (email, users) => {
  for (let item in users) {
    if (users[item].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = {
  getsUserByEmail,
  generateRandomString,
  emailChecker
};