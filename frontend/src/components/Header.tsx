import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  return (
    <div className="flex justify-between items-center mb-10">
      <p className="font-display text-lg font-medium">Workout tracker</p>
      <button
        onClick={handleLogout}
        className="text-xs text-steel hover:text-brass transition-colors"
      >
        Log out
      </button>
    </div>
  );
}

export default Header;