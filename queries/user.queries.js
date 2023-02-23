const User = require('../models/userModel');

exports.createUser = async (body) => {
  try {
    const hashedPassword = await User.hashPassword(body.password);
    const user = new User({ 
      username: body.username,
      local: {
        email: body.email,
        password: hashedPassword
      }
    })
    return user.save();
  } catch(e) {
    throw e;
  }
}

exports.editUser = async (body) => {
  try {
    const hashedPassword = await User.hashPassword(body.password);
    // const user = await User.findOneAndUpdate({ 'local.email': body.email }, {
    //   username: body.username,
    //   local: {
    //     email: this.local.email,
    //     password: '' ? this.local.password : hashedPassword
    //   }
    // },{
    //   new: true
    // });
    const user = await User.findById(body.id)
    console.log(user.username)

    return user.save();
  } catch(e) {
    throw e;
  }
}

exports.findUserPerEmail = (email) => {
  return User.findOne({ 'local.email': email }).exec();
}

exports.findUserPerId = (id) => {
  return User.findOne({ _id: id }).exec();
}