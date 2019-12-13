//Requires and variable definitions
//*********************************
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const { getsUserByEmail,
  generateRandomString,
  emailChecker
} = require('./helpers');

// setting up the cookieSession parameters
app.use(cookieSession({
  name: 'session',
  secret: 'Don',
  maxAge: 24 * 60 * 60 * 1000
}));

// function that returns the URLs where the userID is equal to the id of the currently logged in user.
const urlsForUser = (id) => {
  let urlDatabaseForUser = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urlDatabaseForUser[url] = urlDatabase[url];
    }
  }
  return urlDatabaseForUser;
};

// DATABASES
//*******************************************
// database containing  the urls for tinyApp
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
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
};

// Middleware
//********************************************
// route that renders the urls from urls_index

app.use("/urls", (req, res, next) => {
  if (users[req.session.user_id]) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.use("/urls/new", (req, res, next) => {
  if (users[req.session.user_id]) {
    next();
  } else {
    res.redirect('/login');
  }
});


// Gets
// *****************************************
// Initial setup for the homepage of tinyApp

app.get("/urls", (req, res) => {
  let userInfo = users[req.session.user_id];
  let templateVars = {
    user: userInfo,
    urls: userInfo ? urlsForUser(req.session.user_id) : {}
  };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.redirect('/urls/');
});

// registration of a new user
app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

// user login
app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, user: req.session && users[req.session.user_id] };
  res.render("login", templateVars);
});

// page that displays the urls as a json object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// renders the new urls page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("urls_new", templateVars);
});

// route that renders the short url
app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  } else {
    res.send(401, "Unauthorized. You are not allowed access to this page");
  }
});

// page that displays a basic hello html page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//redirect any request from a short url to its long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});


//Posts
// ******************************************
// to create a random URL for a longURL, checks if http  has been entered at the beginning of the url
app.post("/urls", (req, res) => {
  const randomURL = generateRandomString();
  let httpCheck = req.body.longURL.slice(0, 4);
  if (httpCheck !== 'http') {
    urlDatabase[randomURL] = {
      longURL: 'http://' + req.body.longURL,
      userID: req.session.user_id
    };
  } else urlDatabase[randomURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect("/urls/" + randomURL);
});

// to delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    if (urlDatabase[req.params.shortURL]) {
      delete urlDatabase[req.params.shortURL];
      res.redirect('/urls/');
    }
  } else {
    res.send(401, "Unauthorized. You are not allowed access to this page");
  }
});

// to edit a url, checks if http has been entered at the beginning of the url, only if they are logged in
app.post("/urls/:shortURL/edit", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    if (urlDatabase[req.params.shortURL]) {
      let httpCheck = req.body.longURL.slice(0, 4);
      if (httpCheck !== 'http') {
        urlDatabase[req.params.shortURL].longURL = 'http://' + req.body.longURL;
      } else urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    }
    res.redirect(`/urls/${req.params.shortURL}`);
  } else {
    res.send(401, "Unauthorized. You are not allowed access to this page");
  }
});

// handling the userlogin
app.post("/login", (req, res) => {
  const userId = getsUserByEmail(req.body.email, users);
  if (userId) {
    req.session.user_id = userId;
    res.redirect('/urls');
  } else {
    res.redirect('/register');
  }
});

// handling the user logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls/');
});

// handling the user registration
app.post("/register", (req, res) => {
  const email = req.body['email'];
  const password = bcrypt.hashSync(req.body['password'], 10);
  if (email === '' || password === '') {
    res.statusCode = 404;
    res.send("Error!  Email / Password fields were left blank. Please enter an email and password into the fields");
  } else if (emailChecker(email, users)) {
    res.statusCode = 404;
    res.send("Error! Email address already exists. Please use another email address");
  } else {
    let uniqueId = generateRandomString();
    users[uniqueId] = {
      id: uniqueId,
      email: email,
      password: password
    };
    res.cookie('user_id', uniqueId); // setting a random user id
    res.redirect('/urls/');
  }
});

// Server is up and listening
// ******************************************
// Response to the command line that shows the server is up an running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
