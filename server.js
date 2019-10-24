/** BASIC EXPRESS SETUP
* server.js
* 1. Require Express
* 2. Create a variable to use express
* 3. Allow the use of static assets
*    - examples: css, .js (client-side)
* 4. Require the request library 
*/
const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.static("public"));
const request = require("request");
const jsdom = require("jsdom");
const port = 3000;
const URL = "https://icanhazdadjoke.com";
const nav = ["Home", "Joke1", "Joke2", "Joke3", "Joke4"];
const bg = ["green", "red", "orange", "pink", "blue"];


/** COMPRESSION
* 1. Provides gzip compression for the HTTP response
* 2. Enable gzip compression for all HTTP responses
*/
var compression = require('compression'); 
app.use(compression());

const get_data = async (URL,templateNameString, res) => {
    try {
        console.time("Request time");
            const response = await fetch(URL,{
                "method": "GET",
                "headers": {"Accept": "application/json"}
            });
            const json = await response.json();
            // grab the array inside data by destructuring it
            // remove the spread operator to grab the first item and so on...
            // const [...data] = json.data;
            console.log(json);
            // pass the json response into the the view
            // remember that res.render is part of EXPRESS
            res.render(templateNameString, {
              li: ["Home", "Joke1", "Joke2", "Joke3", "Joke4"],
              number: 5,
              data: json.joke
            });
        console.timeEnd("Request time");
      
        // use a ternary operator to log potential errors
        (err)=> (err) ? console.log(err): console.log("all good")
    } catch (error) {
        console.log(error);
    }
};
/**
* http://expressjs.com/en/starter/basic-routing.html
* @example
  app.get("/", function(request, response) {
    response.sendFile(__dirname + "/views/index.html");
  });
*/



/** TEMPLATE ENGINE
* Express Handlebars is setup here
* 1. Require [jsesc](https://github.com/mathiasbynens/jsesc)
     - This is used in the [helper](https://handlebarsjs.com/block_helpers.html)
     - [liberary of helper function](https://github.com/helpers/handlebars-helpers)
* 2. Define the template engine (hbs aka handlebars)
     - The default layout is the main.hbs file
  3. Set the "view" / "template" engine
    - [app.engine](https://expressjs.com/en/api.html#app.engine)
    - [app.set](https://expressjs.com/en/api.html#app.set)
*/
const jsesc = require('jsesc');
const hbs = require('express-handlebars')({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    static(path) {
      return path;
    },
    escapeJSString(str) {
      if (! str) {
        return null;
      }
      return jsesc(str, {
        // escape everything to \xFF hex sequences so we don't have to worry about script tags and whatnot
        escapeEverything: true, 
        // wrap output with single quotes
        wrap: true 
      });
    }
  }
});
app.engine('hbs', hbs);
app.set('view engine', 'hbs');

/**
* You can also refactor your routes like this later
* @example  
  const routes = require("./routes");
  app.use("/api", routes);
*/



/** PAGES / VIEWS / ROUTES
* Your pages or routes go here
* 1. Route for your home page
* 2. Route for your about page
* 3. Route for any undefined page will send a 404 error.
* 4. Handle errors
*/
app.get('/', (req,res) => {
  res.redirect("/Home");
});
for (var i = 0; i < nav.length; i++) {
  app.get(`/${nav[i]}`, (req,res) => {
  get_data(URL, "index", res);
});
}


/**
* And we end with some more generic node stuff -- listening for requests :-)
* console.log(process.env);
*/
let listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});