"use client"

import { useState } from "react"
import "./login.css"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmail = (e) => setEmail(e.target.value)
  const handlePassword = (e) => setPassword(e.target.value)

  const validateEmail = (email) => {
    if (!email) return "Email is required"
    const valid = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    return valid ? "" : "Email is invalid"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const emailError = validateEmail(email)
    if (!email || !password) {
      setError("All fields are required")
      setIsLoading(false)
    } else if (emailError) {
      setError(emailError)
      setIsLoading(false)
    } else {
      setError("")
      try {
        const response = await axios.post("http://localhost:3001/api/auth/login", {
          email,
          password,
        })

        if (response.data.success) {
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("user", JSON.stringify(response.data.user))
          navigate("/products")
        } else {
          setError(response.data.message)
        }
      } catch (err) {
        console.error("Login error:", err)
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message)
        } else {
          setError("Error occurred during login")
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="logo"></div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>

          <div className="auth-links">
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
            <span className="separator">•</span>
            <span className="dashboard-text">Admin Portal</span>
          </div>
        </div>

        {/* Form Section - Properly Contained */}
        <div className="form-section">
          <h3 className="form-title">Enter your credentials</h3>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                onChange={handleEmail}
                value={email}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                onChange={handlePassword}
                value={password}
                required
              />
            </div>

            <button type="submit" className={`submit-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
              {isLoading ? "" : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
