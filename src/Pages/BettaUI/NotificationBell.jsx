import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function NotificationBell({ userId }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [userId]);

  const loadNotifications = async () => {
    const allNotifications = await base44.entities.Notification.filter(
      { user_id: userId },
      "-created_date",
      20
    );
    setNotifications(allNotifications);
    setUnreadCount(allNotifications.filter(n => !n.is_read).length);
  };

  const markAsRead = async (notificationId) => {
    await base44.entities.Notification.update(notificationId, { is_read: true });
    await loadNotifications();
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    for (const notification of unread) {
      await base44.entities.Notification.update(notification.id, { is_read: true });
    }
    await loadNotifications();
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(createPageUrl(notification.link));
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      check_in: "🅿️",
      check_out: "✅",
      payment: "💰",
      pause: "⏸️",
      resume: "▶️",
      invite: "📧",
      bonus: "🎁",
      discount: "🏷️",
      alert: "⚠️"
    };
    return icons[type] || "📬";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(notification.created_date), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}