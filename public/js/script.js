const jwt = require("jsonwebtoken")
require("dotenv").config()
jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET)
const account = document.querySelector("#myAccount")
    account.addEventListener("click", function () {
      const welcome = document.querySelector("#welcome")
      welcome.removeAttribute('type="hidden"')
      account.replaceWith('<a href="/account/login" id="getOut">Logout</a>')
    })
const getOut = document.querySelector("#getOut")
    getOut.addEventListener("click", function (){
        welcome.replaceWith('<a href="/account/management" type="hidden" id="welcome">Welcome</a>')
        getOut.replaceWith('<a title="Click to log in" href="/account/login" id="myAccount">My Account</a>')
        res.clearCookie("jwt")
        res.locals.loggedin = 0
      return res.redirect("/") 
    })