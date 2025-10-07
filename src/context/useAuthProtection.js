import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthProtection = (requiredRole) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/', { 
        replace: true,
        state: { from: location }
      });
      return;
    }

    // If role is required and doesn't match, redirect to appropriate dashboard
    if (requiredRole && user.role !== requiredRole) {
      const dashboardPath = 
        user.role === 'student' ? '/dash' :
        user.role === 'admin' ? '/admin' :
        user.role === 'examDiv' ? '/exam' : '/';
      
      navigate(dashboardPath, { replace: true });
    }
  }, [user, requiredRole, navigate, location]);

  return { user };
};
