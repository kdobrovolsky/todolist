import { useState } from "react"
import {
  changeThemeModeAC,
  selectAppStatus,
  selectIsLoggedIn,
  selectThemeMode,
  setIsLoggedInAC,
} from "@/app/appSlice.ts"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material"
import {
  AccountCircle as AccountIcon,
  DarkMode as DarkModeIcon,
  Dashboard as DashboardIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material"

import { Path } from "@/common/routing/Routing.tsx"
import { useLogoutMutation } from "@/features/auth/api/authApi.ts"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { baseApi } from "@/app/baseApi.ts"
import { Navigate } from "react-router/internal/react-server-client"

export const Header = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectAppStatus)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()
  const theme = getTheme(themeMode)
  const [logoutMutation] = useLogoutMutation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const notificationsOpen = Boolean(notificationsAnchorEl)

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  if (!isLoggedIn) {
    return <Navigate to={Path.Login} />
  }

  const handleLogout = async () => {
    try {
      const res = await logoutMutation().unwrap()
      if (res.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: false }))
        localStorage.removeItem(AUTH_TOKEN)
        dispatch(baseApi.util.invalidateTags(["Todolist"]))
      }
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null)
  }

  // Моковые уведомления
  const notifications = [
    { id: 1, text: "Task 'Complete project' is due tomorrow", time: "2 hours ago" },
    { id: 2, text: "You have 3 pending tasks", time: "1 day ago" },
  ]

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background:
            themeMode === "dark"
              ? "linear-gradient(135deg, #1a237e 0%, #311b92 100%)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${themeMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)"}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {/* Логотип и бренд */}
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <DashboardIcon />
              </IconButton>

              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: "flex",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".2rem",
                  color: "inherit",
                  textDecoration: "none",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    bgcolor: "white",
                    color: theme.palette.primary.main,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.8rem",
                  }}
                >
                  TODO
                </Box>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Manager
                </Box>
              </Typography>
            </Box>

            {/* Навигация и элементы управления */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.5 } }}>
              {/* Кнопка уведомлений */}
              <Tooltip title="Notifications">
                <IconButton
                  size="medium"
                  color="inherit"
                  onClick={handleNotificationsOpen}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Меню уведомлений */}
              <Menu
                anchorEl={notificationsAnchorEl}
                open={notificationsOpen}
                onClose={handleNotificationsClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 300,
                    borderRadius: 2,
                    overflow: "visible",
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem disabled sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Notifications
                </MenuItem>
                {notifications.map((notification) => (
                  <MenuItem key={notification.id} sx={{ py: 1.5 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                      <Typography variant="body2">{notification.text}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.time}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem
                  sx={{
                    justifyContent: "center",
                    borderTop: 1,
                    borderColor: "divider",
                    py: 1.5,
                  }}
                >
                  <Typography variant="body2" color="primary">
                    View all notifications
                  </Typography>
                </MenuItem>
              </Menu>

              {/* Переключение темы */}
              <Tooltip title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}>
                <Box sx={{ display: "flex", alignItems: "center", mx: 1 }}>
                  <LightModeIcon fontSize="small" sx={{ color: "rgba(255,255,255,0.7)" }} />
                  <Switch
                    checked={themeMode === "dark"}
                    onChange={changeMode}
                    size="small"
                    sx={{
                      m: 0.5,
                      "& .MuiSwitch-track": {
                        bgcolor: "rgba(255,255,255,0.3)",
                      },
                      "& .MuiSwitch-thumb": {
                        bgcolor: "white",
                      },
                    }}
                  />
                  <DarkModeIcon fontSize="small" sx={{ color: "rgba(255,255,255,0.7)" }} />
                </Box>
              </Tooltip>

              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleMenuOpen}
                  size="medium"
                  sx={{
                    ml: 1,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "rgba(255,255,255,0.2)",
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <AccountIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* Меню пользователя */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    overflow: "visible",
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem disabled sx={{ fontWeight: 600, color: "text.secondary" }}>
                  kdobrovolsky02@gmail.com
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <AccountIcon sx={{ mr: 2, fontSize: 20 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleLogout()
                  }}
                  sx={{
                    color: "error.main",
                    borderTop: 1,
                    borderColor: "divider",
                  }}
                >
                  <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>

          {status === "loading" && (
            <LinearProgress
              variant="indeterminate"
              sx={{
                height: 3,
                bgcolor: "transparent",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #ff6b6b 0%, #4ecdc4 100%)",
                },
              }}
            />
          )}
        </Container>
      </AppBar>

      <Toolbar sx={{ mb: 3 }} />
    </>
  )
}