//Requires and variable definitions
//
const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
// using the cookie parser
app.use(cookieParser())
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


// DATABASE
// database containing  the urls for tinyApp
//*******************************************
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// user data object
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

// handling the cookies
app.use("/urls", (req, res, next) => {
  if (req.cookies["username"]) {
    next();
  } else {
    res.redirect('/login');
  }
})

app.use("/urls/new", (req, res, next) => {
  if (req.cookies["username"]) {
    next();
  } else {
    res.redirect('/login');
  }
})


// Gets
// ******************************************
// Initial setup for the homepage of tinyApp
app.get("/", (req, res) => {
  res.send("Hello!");
});

// registration of a new user
app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies.id] };
  res.render("register", templateVars);
});


// page that displays the urls as a json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// renders the new urls page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// route that renders the short url 
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

// route that renders the urls from urls_index
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// page that displays a basic hello html page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//redirect any request from a short url to its long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//Posts
// ******************************************
// to create a random URL for a longURL, checks if http  has been entered at the beginning of the url
app.post("/urls", (req, res) => {
  const randomURL = generateRandomString();
  let httpCheck = req.body.longURL.slice(0, 4)
  if (httpCheck !== 'http') {
    urlDatabase[randomURL] = 'http://' + req.body.longURL
  } else urlDatabase[randomURL] = req.body.longURL;
  res.redirect("/urls/" + randomURL);
});

// to delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls/');
  }
});

// to edit a url, hecks if http has been entered at the beginning of the url
app.post("/urls/:shortURL/edit", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    let httpCheck = req.body.longURL.slice(0, 4)
    if (httpCheck !== 'http') {
      urlDatabase[req.params.shortURL] = 'http://' + req.body.longURL
    } else urlDatabase[req.params.shortURL] = req.body.longURL;
  }
  res.redirect(`/urls/${req.params.shortURL}`)
});


// handling the user logout
app.post("/logout", (req, res) => {
  res.clearCookie(req.cookies["usersname"]);
  res.redirect('/urls/');
});

// user login
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls/');
});

// checking if new email is already existing
const emailChecker = function (email) {
  for (let item in users) {
    if (users[item].email === email) {
      return true;
    }
  }
  return false;
}

// handling the user registration 
app.post("/register", (req, res) => {
  email = req.body['email'];
  password = req.body['password'];
  if (email === '' ||password === '') {
    res.statusCode = 404;
    res.send("Error!  Email / Password fields were left blank. Please enter an email and password into the fields")
  } else if (emailChecker(email)) {
    res.statusCode = 404;
    res.send("Error! Email address already exists. Please use another email address")
  } else {
    let uniqueId = generateRandomString();
    users[uniqueId] = {id:uniqueId, email: email, password: password};
    res.cookie('user_Id', uniqueId); // setting a random user id
    res.redirect('/urls/');
  }
});

// Function that generates a random string for shortening a url 
const generateRandomString = () => {
  let result = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqurstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Server's up and listening
// ******************************************
// Response to the command line that shows the server is up an running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
