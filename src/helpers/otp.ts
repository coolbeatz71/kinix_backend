const generateOTP = (length: number): string => {
  let OTP = '';
  const digits = '0123456789';
  for (let i = 0; i < length; i += 1) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export default generateOTP;
