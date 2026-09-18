import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LogWorkoutPage from "./pages/LogWorkoutPage";
import MuscleSelectPage from "./pages/MuscleSelectpage";
import SessionDetailPage from "./pages/SessionDetailPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/log" element={<ProtectedRoute><MuscleSelectPage /></ProtectedRoute>} />
        <Route path="/log/:sessionId" element={<ProtectedRoute><LogWorkoutPage /></ProtectedRoute>} />
        <Route path="/sessions/:sessionId" element={<ProtectedRoute><SessionDetailPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />     
      </Routes>
    </BrowserRouter>
  );
}

export default App;
