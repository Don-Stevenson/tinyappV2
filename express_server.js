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
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Gets
// *************
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

// route that renders the urls from urls_index
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// route that renders the short url 
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});


// page that displays a basic hello html page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Posts
//********************
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});


// Function that generates a random string for shortening a url 
function generateRandomString() {
  let result = "";
  let chars = "abcdefghijklmnopqurstuvwxyz";
  chars += "0123456789";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


//Server up and listening
//***********************
// Response to the command line that shows the server is up an running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
