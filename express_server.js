//Requires and variable definitions
//
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


// DATABASE
// database containing the urls for tinyApp
//*******************************************
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Gets
// ******************************************
// Initial setup for the homepage of tinyApp
app.get("/", (req, res) => {
  res.send("Hello!");
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



//here problems

//Posts
//**********************************************
app.post("/urls", (req, res) => {
  const randomURL = generateRandomString();
  let httpCheck = req.body.longURL.slice(0, 4)
  if (httpCheck !== 'http') {
    urlDatabase[randomURL] = 'http://' + req.body.longURL
  } else urlDatabase[randomURL] = req.body.longURL;
  // let templateVars = {shortURL: randomURL, longURL: req.body.longURL}

  // console.log(urlDatabase);
  res.redirect("/urls/" + randomURL);
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


//Server up and listening
//**********************************************
// Response to the command line that shows the server is up an running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
