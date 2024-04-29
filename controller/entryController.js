
// const Admin = require("../../models/adminModel");
// const { comparePassword } = require("../utils/password");
// const { generateToken } = require("../utils/tokens");
// const Doctor = require("../../models/doctorModel");
// const Patient= require("../../models/patientModel");
// const Notification = require("../../models/notificationModel");

// async function userExist(req, res) {
//   const { username } = req.params;
//   const user = await Admin.findOne({ username });
//   try {
//     if (user) {
//       return res.status(409).json({
//         success: false,
//         message: "Username already exists",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Username is available",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

// /**
//  * Creates a new user with the provided username, email, and password.
//  * @async
//  * @function signUp
//  * @param {Object} req - The request object.
//  * @param {Object} res - The response object.
//  * @returns {Object} The response object.
//  * @throws {Error} - The error message.
//  */

// async function signUp(req, res) {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { username, email, password, gender } = req.body;
//   try {
//     //validate email
//     if (!validateEmail(email)) {
//       return res.status(400).json({ message: "Invalid email address" });
//     }

//     let userExist = await Admin.findOne({ username });
//     if (userExist) {
//       return res.status(409).json({
//         success: false,
//         message: "Username already exists",
//       });
//     }

//     //validate password
//     if (!validatePassword(password)) {
//       return res
//         .status(400)
//         .json({ message: "Password doesn't meet the requirements" });
//     }

//     const user = new Admin({
//       adminName,
//       email,
//       password,
//     });
//     //save user to database
//     await user.save();

//     //send verification email
//     const token = await generateToken(user._id);
//     await sendVerificationMail(email, token);

//     //logins user
//     const accessToken = await generateToken(user._id);

//     //status
//     return res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       accessToken,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

//  async function adminLogin(req, res){
//     const { username, password } = req.body;
//     if (!username || !password) {
//         res.status(400).send('missing username or password');
//         return;
//       }
//       const admin = await Admin.findOne({
//         $or: [{ adminName: username }, { password: password }],
//       });
//       if (!admin) {
//         return res.status(404).json({
//           success: false,
//           message: "Invalid credentials, check username or password",
//         });
//            }

//            //compare password
//    const isMatch = await comparePassword(password, admin.password);
//   if (!isMatch) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid credentials, check username or password",
//     });
//   }

//  //generate token
//  const accessToken = await generateToken(admin.adminName);
//  return res.status(200).json({
//    success: true,
//    message: "Login successful",
//    accessToken,
//  });



// }
// async function doctorsLogin(req, res) {
//   const { username, password } = req.body;
//   if (!username || !password) {
//       res.status(400).send('missing username or password');
//       return;
//     }
//     const doctor = await Doctor.findOne({
//       $or: [{ doctorName: username }, { password: password }],
//     });
//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Invalid credentials, check username or password",
//       });
//          }

//          //compare password
//  const isMatch = await comparePassword(password, doctor.password);
// if (!isMatch) {
//   return res.status(401).json({
//     success: false,
//     message: "Invalid credentials, check username or password",
//   });
// }

// //generate token
// const accessToken = await generateToken(doctor.doctorName);
// return res.status(200).json({
//  success: true,
//  message: "Login successful",
//  accessToken,
// });



// }
// async function patientsLogin(req, res)  {
//   const { username, password } = req.body;
//   if (!username || !password) {
//       res.status(400).send('missing username or password');
//       return;
//     }
//     const patient = await Patient.findOne({
//       $or: [{ patientname: username }, { password: password }],
//     });
//     if (!patient) {
//       return res.status(404).json({
//         success: false,
//         message: "Invalid credentials, check username or password",
//       });
//          }

//          //compare password
//  const isMatch = await comparePassword(password, patient.password);
// if (!isMatch) {
//   return res.status(401).json({
//     success: false,
//     message: "Invalid credentials, check username or password",
//   });
// }

// //generate token
// const accessToken = await generateToken(patient.patientname);
// return res.status(200).json({
//  success: true,
//  message: "Login successful",
//  accessToken,
// });



// }



// module.exports = {
//   signUp,
//   patientsLogin,
//   adminLogin,
//   doctorsLogin,
// };