import { type Schema } from "../../data/resource";
import { env } from '$amplify/env/resend-confirmation-code'
import {
  AdminGetUserCommand, CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand, UserNotFoundException
} from "@aws-sdk/client-cognito-identity-provider"

const client = new CognitoIdentityProviderClient()

export const handler: Schema["resendConfirmationCode"]["functionHandler"] = async (event) => {
  const { email, cognitoClientId } = event.arguments;
  const getUserCommand = new AdminGetUserCommand({
    Username: email,
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  });

  try {
    const getUserResponse = await client.send(getUserCommand);
    if (getUserResponse.$metadata.httpStatusCode !== 200) {
      return { isConfirmationCodeResent: false, userId: null, errorMessage: "500 - Internal Server Error." };
    }

    const isUserVerified = getUserResponse.UserAttributes?.find((attribute) => {
      return attribute.Name === "email_verified";
    })?.Value === "true";

    if (isUserVerified) {
      return { isConfirmationCodeResent: false, userId: null, errorMessage: "User email is already verified." };
    }

    const userSubId = getUserResponse.UserAttributes?.find((attribute) => {
      return attribute.Name === "sub";
    })?.Value;

    if (!userSubId) {
      return { isConfirmationCodeResent: false, userId: null, errorMessage: "500 - No sub ID found for user email." };
    }

    const resendConfirmationInput = {
      ClientId: cognitoClientId,
      Username: userSubId
    };
    const resendConfirmationCommand = new ResendConfirmationCodeCommand(resendConfirmationInput);
    const resendConfirmationResponse = await client.send(resendConfirmationCommand);

    if (resendConfirmationResponse.$metadata.httpStatusCode !== 200) {
      return { isConfirmationCodeResent: false, userId: null, errorMessage: "500 - Internal Server Error." };
    }
    return { isConfirmationCodeResent: true, userId: userSubId, errorMessage: null };
  } catch (error) {
    console.log(error);
    if (error instanceof UserNotFoundException) {
      return { isConfirmationCodeResent: false, userId: null, errorMessage: "No unverified account associated with requested email." }
    }
    return { isConfirmationCodeResent: false, userId: null, errorMessage: "500 - Internal Server Error" };
  }
}