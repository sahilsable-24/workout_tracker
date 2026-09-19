import { useNavigate, Link } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/login");
  }

  return (
    <div className="flex justify-between items-center mb-10">
      <Link to="/" className="font-display text-lg font-medium hover:text-brass transition-colors">
        Workout tracker
      </Link>      
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