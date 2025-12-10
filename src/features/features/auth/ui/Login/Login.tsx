import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import {
  LockOpen as LockOpenIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  GitHub as GitHubIcon,
  Telegram as TelegramIcon,
  Info as InfoIcon,
} from "@mui/icons-material"

import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectIsLoggedIn, setIsLoggedInAC } from "@/app/appSlice.ts"
import { Path } from "@/common/routing/Routing.tsx"
import { useLoginMutation } from "@/features/auth/api/authApi.ts"
import { LoginInputs, loginSchema } from "@/features/auth/lib/schemas/loginSchema.ts"
import { ResultCode } from "@/common/enums"
import { AUTH_TOKEN } from "@/common/constants"
import { Navigate } from "react-router/internal/react-server-client"

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const [loginMutation, { isLoading, error }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginInputs) => {
    try {
      const res = await loginMutation(data).unwrap()

      if (res.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        localStorage.setItem(AUTH_TOKEN, res.data.token)
        reset()
      }
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleUseDemoCredentials = () => {
    reset({
      email: "free@samuraijs.com",
      password: "free",
      rememberMe: false,
    })
  }

  if (isLoggedIn) {
    return <Navigate to={Path.Main} />
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              mx: "auto",
              mb: 2,
              bgcolor: "primary.main",
            }}
          >
            <LockOpenIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your TodoList account
          </Typography>
        </Box>

        {/* Информация о проекте */}
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            bgcolor: "action.hover",
            borderColor: "primary.light",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
            <InfoIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" fontWeight={500}>
              Demo Project • React + MUI + RTK Query
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" paragraph>
            This is a training project showcasing modern React stack with TypeScript.
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<GitHubIcon />}
              href="https://github.com/kdobrovolsky"
              target="_blank"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              View Code
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TelegramIcon />}
              href="https://t.me/k_dobrovolsky"
              target="_blank"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Contact
            </Button>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            Login failed. Please check your credentials.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <TextField
              {...register("email")}
              label="Email address"
              type="email"
              variant="outlined"
              size="medium"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color={errors.email ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
              fullWidth
              autoComplete="email"
            />

            <TextField
              {...register("password")}
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              size="medium"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon color={errors.password ? "error" : "action"} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              autoComplete="current-password"
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => <Checkbox {...field} checked={field.value} size="small" />}
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Link href="#" variant="body2" sx={{ textDecoration: "none" }}>
                Forgot password?
              </Link>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isValid || isLoading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
              fullWidth
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>

            {/* Divider */}
            <Divider>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "background.default",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={500}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <InfoIcon color="info" fontSize="small" />
                Quick test access
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip label="Email" size="small" variant="outlined" sx={{ minWidth: 60 }} />
                  <Typography variant="body2" fontFamily="monospace" color="text.primary">
                    free@samuraijs.com
                  </Typography>
                  <Button
                    size="small"
                    onClick={() =>
                      reset({
                        ...control._formValues,
                        email: "free@samuraijs.com",
                      })
                    }
                    sx={{ ml: "auto" }}
                  >
                    Use
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip label="Password" size="small" variant="outlined" sx={{ minWidth: 60 }} />
                  <Typography variant="body2" fontFamily="monospace" color="text.primary">
                    free
                  </Typography>
                  <Button
                    size="small"
                    onClick={() =>
                      reset({
                        ...control._formValues,
                        password: "free",
                      })
                    }
                    sx={{ ml: "auto" }}
                  >
                    Use
                  </Button>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={handleUseDemoCredentials}
                  sx={{ mt: 1, borderRadius: 2 }}
                >
                  Use Demo Account
                </Button>
              </Stack>
            </Paper>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <Link href="https://social-network.samuraijs.com" target="_blank" sx={{ fontWeight: 600 }}>
                Register here
              </Link>
            </Typography>
          </Stack>
        </form>
      </Card>
    </Box>
  )
}
