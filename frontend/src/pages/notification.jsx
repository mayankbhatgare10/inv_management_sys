"use client"

import { useState } from "react"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"
import "./notification.css"

function Notification({ notifications }) {
  const [filter, setFilter] = useState("all")

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    return notification.type === filter
  })

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="notification-icon success" />
      case "error":
        return <AlertCircle size={16} className="notification-icon error" />
      case "info":
      default:
        return <Info size={16} className="notification-icon info" />
    }
  }

  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="notification-page">
      <div className="notification-header">
        <h1>Notifications</h1>
        <div className="notification-s">
          <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          <button
            className={`filter-button ${filter === "success" ? "active" : ""}`}
            onClick={() => setFilter("success")}
          >
            Success
          </button>
          <button className={`filter-button ${filter === "error" ? "active" : ""}`} onClick={() => setFilter("error")}>
            Error
          </button>
          <button className={`filter-button ${filter === "info" ? "active" : ""}`} onClick={() => setFilter("info")}>
            Info
          </button>
        </div>
      </div>

      <div className="notification-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              {getIcon(notification.type)}
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{formatTime(notification.timestamp)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-notifications">
            <Bell size={48} className="empty-icon" />
            <p>No notifications yet</p>
            {filter !== "all" && <p className="empty-subtitle">Try changing your filter</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification