import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CalendarPage from "./pages/CalendarPage";
import MuscleSelectPage from "./pages/MuscleSelectpage";
import LogWorkoutPage from "./pages/LogWorkoutPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/log/new/:date" element={<ProtectedRoute><MuscleSelectPage /></ProtectedRoute>} />
        <Route path="/log/:sessionId" element={<ProtectedRoute><LogWorkoutPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;