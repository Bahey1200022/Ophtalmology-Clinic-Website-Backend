
const Admin = require("../models/adminModel");



const entryController={

 adminLogin: async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send('missing username or password');
        return;
      }
      const admin = await Admin.findOne({
        $or: [{ adminName: username }, { password: password }],
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Invalid credentials, check username or password",
        });
           }

           //compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials, check username or password",
    });
  }

 //generate token
 const accessToken = await generateToken(admin.adminName);
 return res.status(200).json({
   success: true,
   message: "Login successful",
   accessToken,
 });


}}

module.exports = entryController;