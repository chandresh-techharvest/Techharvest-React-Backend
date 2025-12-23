
const verifyCaptcha = async (token) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secret}&response=${token}`,
      }
    );

    const data = await response.json();

    if (!data.success) return false;

    // score ranges 0.0 (bot) → 1.0 (human)
    return data.score >= 0.5;
  } catch (error) {
    console.error("Captcha Verification error:", error);
    return false;
  }
};

export default verifyCaptcha;