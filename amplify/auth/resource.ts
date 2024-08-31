import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';
import { resendConfirmationCode } from '../functions/resend-confirmation-code/resource';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: 'Welcome to Cubit! Verify your email!',
      verificationEmailBody: (createCode) => `Use this code to confirm your account: ${createCode()}`
    },
  },
  userAttributes: {
    preferredUsername: {
      required: true,
      mutable: false
    }
  },
  triggers: {
    postConfirmation
  },
  access: (allow) => [
    allow.resource(resendConfirmationCode).to(["getUser"])
  ]
});
