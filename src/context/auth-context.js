import { createContext } from 'react';

// Create the auth context with default values
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true
});

export default AuthContext;