
// function that finds user by email, returning the user

const getsUserByEmail = (email, users) => {
  for (let item in users) {
    if (users[item].email === email) {
      return users[item].id;
    }
  }
  return undefined;
};



module.exports = { getsUserByEmail }