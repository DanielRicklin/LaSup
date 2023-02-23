const { createUser, editUser } = require('../queries/user.queries');

exports.userNew = (req, res, next) => {
  res.render('pages/auth', { page: "signup", error: null, user: req.user });
}

exports.userCreate = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await createUser(body);
    req.login(user);
    res.redirect('/', { user: req.user });
  } catch(e) {
    res.render('pages/auth', { page: "signup", error: e.message, user: req.user });
  }
}

// exports.getUsers = function(req, res){
//     res.render('pages/user', {user: req.user});
// }

exports.getProfile = function(req, res){
  res.render('pages/user', { page: "profile", error: null, user: req.user });
}

exports.updateUser = async function(req, res, next){
  try {
    const body = req.body;
    const user = await editUser(body);
    req.login(user);
    res.render('pages/user', { page: "profile", error: null, user: req.user });
  } catch(e) {
    res.render('pages/user', { page: "profile", error: e.message, user: req.user });
  }
}