
// function that finds user by email, returning the user
const getsUserByEmail = (email, urlDatabase) => {
  let user = {}
  for (let item in urlDatabase) {
    if (urlDatabase[item].email === email) {
      return urlDatabase[item];
    }
  }
  return user;
};

module.exports = { getUserByEmail }