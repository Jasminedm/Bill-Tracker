const ObjectId = require("mongodb").ObjectId;
module.exports = function (app, passport, db, ObjectId) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection('bills').find({user: req.user.local.email}).toArray((err, result) => {
      if (err) return console.log(err)
      result = result.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      displayResult = [result[0]]
        res.render('profile.ejs', {
          results: displayResult,
          user : req.user,
        })
    })
      });
  // LOGOUT ==============================
  app.get("/mybills", isLoggedIn, function (req, res) {
    db.collection('bills').find({user: req.user.local.email}).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result[0])
      //result = result.sort((a,b)=>a.date.getDate()-b.date.getDate());
      result = result.sort((a,b) => Date.parse(a.date) - Date.parse(b.date)) 
      res.render('mybills.ejs', {
          results: result,
          user : req.user

        })
    })
  });

  app.get("/nexthome", isLoggedIn, function (req, res) {
    res.render("nexthome.ejs");
  });

  app.get("/findexperience", isLoggedIn, function (req, res) {
    res.render("findexperience.ejs");
  });

  app.get("/connect", isLoggedIn, function (req, res) {
    res.render("connect.ejs");
  });

  // app.get('/mybills', async (req, res) => {

  // })
  // message board routes ===============================================================

  app.post("/track", isLoggedIn, (req, res) => {
    db.collection("bills").save(
      { user: req.user.local.email, company: req.body.company, date: req.body.date, due: req.body.due },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/mybills");
      }
    );
  });

  app.put("/edit", (req, res) => {
    console.log(req.body);
    db.collection("bills").findOneAndUpdate(
      {_id: ObjectId(req.body._id)},
      {
        $set: {
          due: req.body.updateTxt
        },
      },
      {
        sort: { _id: -1 }
        
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  
  app.delete("/billList", (req, res) => {
    db.collection("bills").findOneAndDelete(
      { _id: ObjectId(req.body.id)},
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
