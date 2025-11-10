import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskManager from "./components/TaskManager";
import Header from "./components/Header";
import "./App.css";

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="App">
      {user && <Header />}
      <Routes>
        <Route
          path="/login"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <TaskManager /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <Login onToggleMode={() => setIsLogin(false)} />
      ) : (
        <Register onToggleMode={() => setIsLogin(true)} />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
