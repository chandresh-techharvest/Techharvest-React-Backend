import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

// Create the reCAPTCHA client.
// TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g,"\n");
const client = new RecaptchaEnterpriseServiceClient({
  projectId: process.env.GCLOUD_PROJECT,
  credentials:{
    client_email:process.env.GOOGLE_CLIENT_EMAIL,
    private_key:privateKey,
  },
});

async function verifyCaptcha(token) {
  const projectID = process.env.RECAPTCHA_PROJECT_ID;
  const recaptchaKey = process.env.RECAPTCHA_SITE_KEY;
  const recaptchaToken = token;
  const recaptchaAction = "contact_form";

  // Build the project path.
  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request = {
    assessment: {
      event: {
        token: recaptchaToken,
        siteKey: recaptchaKey,
        expectedAction:recaptchaAction,
      },
    },
    parent: projectPath,
  };

  const [response] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(
      `The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`
    );
    return null;
  }

  // Check if the expected action was executed.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });

    return response.riskAnalysis.score >= 0.8 ? true : false;
  } else {
    console.log(
      "The action attribute in your reCAPTCHA tag does not match the action you are expecting to score"
    );
    return null;
  }
}

export default verifyCaptcha;
