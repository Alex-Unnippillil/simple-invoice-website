import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  PublicKeyCredentialDescriptorJSON,
} from '@simplewebauthn/typescript-types';

export interface PasskeyDevice {
  id: string;
  publicKey: string;
  counter: number;
  transports?: AuthenticatorTransport[];
}

export interface UserPasskeys {
  id: string;
  username: string;
  devices: PasskeyDevice[];
  currentChallenge?: string;
}

export function createRegistrationOptions(user: UserPasskeys) {
  const options = generateRegistrationOptions({
    rpName: 'Simple Invoice',
    rpID: 'localhost',
    userID: user.id,
    userName: user.username,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
    supportedAlgorithmIDs: [-7, -257],
  });
  user.currentChallenge = options.challenge;
  return options;
}

export function verifyRegistration(
  user: UserPasskeys,
  response: RegistrationResponseJSON,
): Promise<VerifiedRegistrationResponse> {
  if (!user.currentChallenge) {
    throw new Error('No challenge set for user');
  }
  return verifyRegistrationResponse({
    response,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: 'http://localhost:3000',
    expectedRPID: 'localhost',
    requireUserVerification: true,
  });
}

export function createAuthenticationOptions(
  user: UserPasskeys,
) {
  const options = generateAuthenticationOptions({
    rpID: 'localhost',
    allowCredentials: user.devices.map((dev) => ({
      id: dev.id,
      type: 'public-key',
      transports: dev.transports,
    })) as PublicKeyCredentialDescriptorJSON[],
    userVerification: 'preferred',
  });
  user.currentChallenge = options.challenge;
  return options;
}

export function verifyAuthentication(
  user: UserPasskeys,
  response: AuthenticationResponseJSON,
): Promise<VerifiedAuthenticationResponse> {
  if (!user.currentChallenge) {
    throw new Error('No challenge set for user');
  }
  const authenticator = user.devices.find((dev) => dev.id === response.id);
  return verifyAuthenticationResponse({
    response,
    expectedChallenge: user.currentChallenge,
    expectedOrigin: 'http://localhost:3000',
    expectedRPID: 'localhost',
    authenticator,
    requireUserVerification: true,
  });
}
