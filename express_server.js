const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// database containing the urls for tinyApp
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Initial setup for the homepage of tinyApp
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Response to the command line that shows the server is up an running
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});