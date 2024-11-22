import { message } from 'antd';

const ProtectedRoute = ({ children, allowGuest = false }) => {
  const user = localStorage.getItem("user");
  const guest = localStorage.getItem('guest');

  if (!user && guest!='true') {
    // If neither user nor guest is logged in, display an error message and redirect to login page after a delay
    message.error('Please Login in to access this page.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000); // 2 seconds delay
    return null;
  }

  if (guest==='true' && !allowGuest) {
    // If guest is logged in but the route does not allow guests, redirect to guest dashboard
    message.error('You must be logged in to access this page.');
    setTimeout(() => {
      window.location.href = '/guestDashboard';
    }, 2000); // 2 seconds delay
    return null;
  }

  // If user is logged in or guest is allowed, render the children components
  return children;
};

export default ProtectedRoute;