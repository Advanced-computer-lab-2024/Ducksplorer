import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItemButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { fToNow } from "./TopNav/format-time";
import Iconify from "./TopNav/iconify.js";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

function MyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(null);
  const [latestNotification, setLatestNotification] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const userName = JSON.parse(localStorage.getItem("user")).username;
  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`http://localhost:8000/notification/getNotifications/${userName}`)
        .then((response) => {
          if (response.data.length > notifications.length) {
            if (soundEnabled === true) {
              audioRef.current.play();
            }
            setTimeout(() => {
              setLatestNotification(response.data[response.data.length - 1]);
            }, 1000); // Adjust the timeout duration as needed
          }
          setTimeout(() => {
            setNotifications(response.data);
          }, 1000); // Adjust the timeout duration as needed
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the notifications!",
            error
          );
        });
    }, 3000);
    return () => clearInterval(interval);
  }, [notifications]);

  const totalUnRead = notifications.filter(
    (item) => item.seen === false
  ).length;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
    setLatestNotification(null);
  };

  const handleMarkAsRead = (id) => {
    axios
      .put(`http://localhost:8000/notification/markAsSeen/${id}`)
      .then((response) => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id !== id)
        );
      })
      .catch((error) => {
        console.error(
          "There was an error marking the notification as read!",
          error
        );
      });
  };

  const handleLatestNotificationClick = () => {
    setOpen(true);
    setLatestNotification(null);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <>
      <audio ref={audioRef} src="quack.mp3" />
      <Tooltip >
        <IconButton
          color={open ? "primary" : "default"}
          onClick={handleOpen}
          sx={{ p: 0, ml: 4, width: 40, height: 40 }}
        >
          <Badge badgeContent={totalUnRead} color="error">
            <NotificationsIcon sx={{ color: "black", '&:hover': {
                  color: "#ff9933"
                },}} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={!!latestNotification}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        {latestNotification && (
          <>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                display: "block",
                textAlign: "center",
                mt: 1.5,
                color: "green",
              }}
            >
              New Notication Received
            </Typography>
            <ListItem
              onClick={handleLatestNotificationClick}
              sx={{
                py: 1.5,
                px: 2.5,
                mt: "1px",
                bgcolor: "action.selected",
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "background.neutral" }}>
                  <img
                    src={"duckAvatar.png"}
                    alt="Avatar"
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", display: "block" }}
                  >
                    {latestNotification.title || "No title"}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {latestNotification.message}
                  </Typography>
                }
              />
            </ListItem>
          </>
        )}
      </Popover>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, position: "end" }}>
            {soundEnabled ? (
              <Tooltip title="Turn off Notication sound">
                <IconButton>
                  <VolumeUpIcon
                    sx={{ fontSize: 30, color: "green" }}
                    onClick={handleSoundToggle}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Turn on Notication sound">
                <IconButton>
                  <VolumeMuteIcon
                    sx={{ fontSize: 30, color: "red" }}
                    onClick={handleSoundToggle}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ overflow: "visible" }}>
          <List disablePadding>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </List>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />
      </Popover>
    </>
  );
}

function NotificationItem({ notification, onMarkAsRead }) {
  const { avatar, message, title } = renderContent(notification);

  return (
    <ListItem
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(!notification.seen && {
          bgcolor: "action.selected",
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={message}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Iconify
              icon="eva:clock-outline"
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
            {fToNow(notification.date)}
          </Typography>
        }
      />
      <Tooltip title="Mark as read">
        <IconButton
          color="primary"
          onClick={() => onMarkAsRead(notification._id)}
          sx={{ width: 40, height: 40, margin: 5 }}
        >
          <Iconify icon="eva:done-all-fill" />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
}

function renderContent(notification) {
  const title = (
    <Typography
      variant="subtitle2"
      sx={{ fontWeight: "bold", display: "block" }}
    >
      {notification.title || "No title"}
    </Typography>
  );

  const message = (
    <Typography
      variant="body2"
      sx={{
        color: "text.secondary",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      }}
    >
      {notification.message}
    </Typography>
  );

  return {
    avatar: (
      <img
        src={"duckAvatar.png"}
        alt="Avatar"
        style={{ width: 40, height: 40, borderRadius: "50%" }}
      />
    ),
    message: (
      <>
        {title}
        {message}
      </>
    ),
  };
}

export default MyNotifications;
