const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash("error", "Username or email already exists!");
      return res.redirect("/signup");
    }

    // Create new user
    const newUser = await User.createUser(username, email, password);
    console.log("User created successfully:", newUser);

    // Log the user in
    req.login(newUser, (err) => {
      if (err) {
        console.log("Login error:", err);
        req.flash(
          "error",
          "Registration successful but login failed. Please log in manually."
        );
        return res.redirect("/login");
      }
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (e) {
    console.log("Error during signup:", e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
  try {
    let { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error", "Invalid username or password!");
      return res.redirect("/login");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      req.flash("error", "Invalid username or password!");
      return res.redirect("/login");
    }

    console.log("User logged in successfully:", user);

    // Log the user in
    req.login(user, (err) => {
      if (err) {
        console.log("Login error:", err);
        req.flash("error", "Login failed. Please try again.");
        return res.redirect("/login");
      }
      
      req.flash("success", "Welcome back to WanderLust!");
      
      // Redirect to the saved URL or default to /listings
      let redirectUrl = res.locals.redirectUrl || "/listings";
      delete req.session.redirectUrl; // Clean up
      res.redirect(redirectUrl);
    });
  } catch (e) {
    console.log("Error during login:", e);
    req.flash("error", e.message);
    res.redirect("/login");
  }
}

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
}