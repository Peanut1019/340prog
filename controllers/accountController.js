const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } 
  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

    res.render("account/registration", {
      title: "Register",
      nav,
      errors: null,
    })
  }
  
  async function buildSuccess(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/success", {
      title: "Success",
      nav,
      errors: null,
    })
  }
  async function buildManage(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
      title: "Manage Accounts",
      nav,
      errors: null,
    })
  }
  async function buildUpdate(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
  async function buildDelete(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/delete", {
      title: "Delete Account",
      nav,
      errors: null,
    })
  }
  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, hashedPassword } = req.body
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/registration", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

async function manageAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname } = req.body
  let grid
  grid = '<div>'
  if (res.locals.accountData == "Employee", "Admin") {
    grid += '<h2> Welcome' + account_firstname + '</h2>'
    grid += '<h3>Inventory Management</h3>'
    grid += '<p><a href="../../inv/management/">Link Here</a></p>'
  }
  else {
    grid += '<h2> Welcome' + account_firstname + '</h2>'
  }
  grid += '</div>'
  res.render("account/management", {
    title: "Manage Account",
    nav,
    grid
  })
}

 async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    const accountName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The ${accountName} was successfully updated.`)
    res.redirect("/account/management")
  } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", `Sorry, the update of ${accountName} failed.`)
    res.status(501).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {
    hashedPassword,
    account_id
  } = req.body
  hashedPassword = await bcrypt.hashSync(account_password, 10)
  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )

  if (updateResult) {
    req.flash("notice", `The password was successfully updated.`)
    res.redirect("/account/management")
  } else {
    req.flash("notice", `Sorry, the change of the password failed.`)
    res.status(501).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_password,
    account_id
    })
  }
}
async function deleteAccount(req, res, next) {
let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_id
  } = req.body
  const deleteResult = await accountModel.deleteAccount(account_id)

  if (deleteResult) {
    const accName = deleteResult.account_firstname + " " + deleteResult.account_lastname
    req.flash("notice", `The ${accName} was successfully deleted.`)
    res.redirect("/account/")
  } else {
    const accName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("account/delete", {
    title: "Delete " + accName,
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_id
    })
  }
}

 module.exports ={accountLogin, registerAccount, buildLogin, buildRegister, buildSuccess, buildManage, buildUpdate, updateAccount, updatePassword, manageAccount, buildDelete, deleteAccount}