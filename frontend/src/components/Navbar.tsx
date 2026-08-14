import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleHome = () => {
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo / Brand */}
          <button
            type="button"
            onClick={handleHome}
            className="text-left"
          >
            <h1 className="text-xl font-bold text-slate-900">
              Directorate Reserve Seats
            </h1>

            <p className="text-sm text-slate-500">
              Government of Balochistan
            </p>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">

            <button
              type="button"
              onClick={handleHome}
              className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
            >
              Home
            </button>

            <a
              href="#about"
              className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
            >
              Contact
            </a>

            <Button onClick={handleLogin}>
              Student Login
            </Button>

          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className="text-xl">
              {isMenuOpen ? "✕" : "☰"}
            </span>
          </button>

        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 md:hidden">

            <button
              type="button"
              onClick={handleHome}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </button>

            <a
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              About
            </a>

            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Contact
            </a>

            <Button
              className="w-full"
              onClick={handleLogin}
            >
              Student Login
            </Button>

          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;