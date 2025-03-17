import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from '../pages/homepage.jsx';
import Notification from '../pages/notification.jsx';

function AppRoutes({ notifications, addNotification }) {
  return (
    <Routes>
      <Route path="/" element={<Homepage addNotification={addNotification} />} />
      <Route path="/notifications" element={<Notification notifications={notifications} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
