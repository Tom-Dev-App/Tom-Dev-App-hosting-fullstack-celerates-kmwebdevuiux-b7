import { useId } from "react";
import { useUser } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { getRoleByToken } from "../../services/authService";

export default function Navbar({ onSearchChange }) {
  const inputId = useId();
  const { isLoggedIn, logout, accessSecret } = useUser();
  const navigate = useNavigate();

  const handleSearchInput = (e) => {
    onSearchChange(e.target.value);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Mendapatkan peran berdasarkan accessSecret dari UserContext
  const userRoles = accessSecret ? [getRoleByToken(accessSecret)] : [];
  const hasRole = (role) => userRoles.includes(role);

  // Debugging
  // useEffect(() => {
  //   console.log(accessSecret);
  //   console.log(Cookies.get("access_secret"));

  //   console.log(hasRole("admin")); // Debug log
  // }, [accessSecret]); // Pastikan efek dijalankan ketika accessSecret berubah

  return (
    <nav className="grid grid-cols-3 justify-between px-24 py-4 bg-[#8091FF] items-center">
      <ul className="flex items-center">
        <li>
          <Link
            to="/"
            className="text-[#F2F4FF] hover:text-[#565f93] active:text-[#1d2342] text-xl font-bold"
          >
            Home
          </Link>
        </li>
      </ul>

      <ul className="flex justify-center items-center w-full">
        <li className="w-full">
          <input
            type="text"
            id={inputId}
            placeholder="Search product..."
            className="text-black px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#565f93]"
            onChange={handleSearchInput}
            aria-label="Search for products"
          />
        </li>
      </ul>

      {!isLoggedIn ? (
        <ul className="flex gap-4 justify-end">
          <li>
            <Link
              to="/signin"
              className="text-[#F2F4FF] hover:text-[#565f93] font-medium"
            >
              Sign In
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="text-[#F2F4FF] hover:text-[#565f93] font-medium"
            >
              Sign Up
            </Link>
          </li>
        </ul>
      ) : (
        <ul className="flex gap-4 justify-end">
          {hasRole("admin") && (
            <>
              <li>
                <Link
                  to="/products/new"
                  className="text-[#F2F4FF] hover:text-[#565f93] font-medium"
                >
                  New Product
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-[#F2F4FF] hover:text-[#565f93] font-medium"
                >
                  Categories
                </Link>
              </li>
            </>
          )}
          {hasRole("client") && (
            <>
              <li>
                <Link
                  to="/cart"
                  className="text-[#F2F4FF] hover:text-[#565f93] font-medium"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-[#F2F4FF] hover:text-[#565f93] font-medium"
                >
                  My Orders
                </Link>
              </li>
            </>
          )}
          <li>
            <button
              onClick={handleLogout}
              className="text-[#F2F4FF] hover:text-[#565f93] font-medium"
            >
              Sign Out
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
