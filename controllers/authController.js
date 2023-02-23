const { findUserPerEmail } = require('../queries/user.queries');

exports.signinForm = (req, res, next) => {
  res.render('pages/auth', { page: "signin", error: null, user: req.user });
}

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserPerEmail(email);
    if (user) {
      const match = await user.comparePassword(password);
      if (match) {
        req.login(user);
        res.redirect('/');
      } else {
        res.render('pages/auth', { page: "signin", error: 'Wrong password', user: req.user });
      }
    } else {
      res.render('pages/auth', { page: "signin",error: 'User not found', user: req.user });
    }
  } catch(e) {
    next(e);
  }

}

exports.signout = (req, res, next) => {
  req.logout();
  res.redirect('/');
}