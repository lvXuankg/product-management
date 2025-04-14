const express = require('express');
const path = require('path');
var methodOveride = require("method-override");
const bodyParser = require("body-parser");
var flash = require('connect-flash');
var session = require('express-session');
const moment = require('moment');
const http = require("http");
const {Server} = require("socket.io");
require("dotenv").config();
const database = require("./config/database");
var cookies = require('cookie-parser');
const systemConfig = require("./config/system");

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// SocketIO 
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

app.use(methodOveride("_method"));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// use Cookies 
app.use(cookies());
// TinyMCE 
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Flash 

app.use(session({
    secret: 'coding', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash(); // Gán flash messages vào biến locals để Pug truy cập
    next();
});

// End Flash 

// App Locals Variables 
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
// console.log(__dirname);
app.use(express.static(`${__dirname}/public`)); 

//Routes
route(app);
routeAdmin(app);

app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
        pageTitle: "404 Not Found"
    });
});

server.listen(port, () => {
    console.log(`Expample app listening on port ${port}`);
})