import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, error, setError } = useAuth();

  useEffect(() => {
    setError("");
  }, [setError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Your Account</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <p className="auth-toggle">
          Don't have an account?{" "}
          <span onClick={onToggleMode} className="toggle-link">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
