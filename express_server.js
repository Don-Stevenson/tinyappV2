const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");


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



//Server up and listening
//***********************
// Response to the command line that shows the server is up an running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
