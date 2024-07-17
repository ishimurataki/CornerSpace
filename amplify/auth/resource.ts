import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailSubject: 'Welcome! Verify your email!'
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
  }
});
