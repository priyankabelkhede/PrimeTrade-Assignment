import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register, error, setError } = useAuth();

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { confirmPassword, ...userData } = formData;
    await register(userData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <p className="auth-toggle">
          Already have an account?{" "}
          <span onClick={onToggleMode} className="toggle-link">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
