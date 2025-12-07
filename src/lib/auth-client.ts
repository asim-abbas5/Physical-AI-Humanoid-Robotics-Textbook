// Mock auth client for development
import {
  signInMock,
  signUpMock,
  signOutMock,
  useSessionMock
} from './mock-auth';

export const signIn = {
  email: signInMock
};

export const signUp = {
  email: signUpMock
};

export const signOut = signOutMock;

export const useSession = useSessionMock;
