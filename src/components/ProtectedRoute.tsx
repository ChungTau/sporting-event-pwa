import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
    component: React.ComponentType;
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const isLoggedIn = useSelector((state: RootState) => state.authenticated.isLoggedIn);
    const location = useLocation();
    if (!isLoggedIn) {
      // Redirect to the sign-in page
      sessionStorage.setItem('redirectPath', location.pathname);
      return <Navigate to="/sign-in" />;
    }
  
    // Render the component for the protected route
    return <Component />;
  };

  export default ProtectedRoute;