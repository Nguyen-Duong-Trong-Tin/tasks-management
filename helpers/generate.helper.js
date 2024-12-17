const generateOTP = (length) => {
  const characters = "0123456789";
  const characterLength = characters.length;
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterLength);
    otp += characters[randomIndex];
  }

  return otp;
}

const generateHelper = {
  generateOTP
};
module.exports = generateHelper;