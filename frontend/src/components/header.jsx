import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import './header.css';

function Header({ user, notificationCount }) {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Inventory Management System</h1>
        <div className="header-actions">
          <Link to="/notifications" className="notification-link">
            <div className="notification-icon">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
          </Link>
          <div className="profile">
            <div className="profile-icon">
              <User size={20} />
            </div>
            <span className="profile-name">{user?.name || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
