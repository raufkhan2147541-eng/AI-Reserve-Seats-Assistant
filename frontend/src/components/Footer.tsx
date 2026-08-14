const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* ==========================================
              Brand / About
          ========================================== */}

          <div className="lg:col-span-2">

            <h2 className="text-xl font-bold">
              Directorate Reserve Seats
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              An AI-powered student assistance platform designed to help
              students access information about reserved seats, admissions,
              eligibility and related requirements.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                AI Student Assistant
              </span>

              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                Student Support
              </span>

              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                Official Information
              </span>

            </div>

          </div>


          {/* ==========================================
              Quick Links
          ========================================== */}

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-slate-400">

              <li>
                <a
                  href="/"
                  className="transition hover:text-white"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="transition hover:text-white"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="transition hover:text-white"
                >
                  Contact
                </a>
              </li>

              <li>
                <a
                  href="/login"
                  className="transition hover:text-white"
                >
                  Student Login
                </a>
              </li>

            </ul>

          </div>


          {/* ==========================================
              Student Support
          ========================================== */}

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Student Support
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-slate-400">

              <li>Eligibility Information</li>

              <li>Required Documents</li>

              <li>Admission Guidance</li>

              <li>AI Student Assistant</li>

            </ul>

          </div>

        </div>


        {/* ==========================================
            Developed By
        ========================================== */}

        <div 
        id="contact"
        className="mt-10 rounded-2xl border border-slate-800 bg-slate-800/40 p-6">

          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Developed By
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            {/* Rauf Khan */}

            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">

              <p className="font-semibold text-white">
                Rauf Khan Musakhail
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Software Engineer
              </p>

              <a
                href="tel:03422579973"
                className="mt-3 inline-block text-sm text-blue-400 transition hover:text-blue-300"
              >
                📞 0342-2579973
              </a>

            </div>


            {/* Salar Khan */}

            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">

              <p className="font-semibold text-white">
                Salar Khan
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Students Mentor
              </p>

              <a
                href="tel:03443533046"
                className="mt-3 inline-block text-sm text-blue-400 transition hover:text-blue-300"
              >
                📞 0344-3533046
              </a>

            </div>

          </div>

        </div>


        {/* ==========================================
            Bottom
        ========================================== */}

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} Directorate Reserve Seats.
            All rights reserved.
          </p>

          <p className="text-slate-600">
            AI Student Assistant
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;