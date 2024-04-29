
const Admin = require("../models/adminModel");
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/tokens");
const Doctor = require("../models/doctorModel");
const Patient= require("../models/patientModel");


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
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Invalid credentials, check username or password",
        });
           }

           //compare password
   const isMatch = await comparePassword(password, admin.password);
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



},
doctorsLogin: async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      res.status(400).send('missing username or password');
      return;
    }
    const doctor = await Doctor.findOne({
      $or: [{ doctorName: username }, { password: password }],
    });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials, check username or password",
      });
         }

         //compare password
 const isMatch = await comparePassword(password, doctor.password);
if (!isMatch) {
  return res.status(401).json({
    success: false,
    message: "Invalid credentials, check username or password",
  });
}

//generate token
const accessToken = await generateToken(doctor.doctorName);
return res.status(200).json({
 success: true,
 message: "Login successful",
 accessToken,
});



},
patientsLogin: async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      res.status(400).send('missing username or password');
      return;
    }
    const patient = await Patient.findOne({
      $or: [{ patientname: username }, { password: password }],
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials, check username or password",
      });
         }

         //compare password
 const isMatch = await comparePassword(password, patient.password);
if (!isMatch) {
  return res.status(401).json({
    success: false,
    message: "Invalid credentials, check username or password",
  });
}

//generate token
const accessToken = await generateToken(patient.patientname);
return res.status(200).json({
 success: true,
 message: "Login successful",
 accessToken,
});



}

}

module.exports = entryController;