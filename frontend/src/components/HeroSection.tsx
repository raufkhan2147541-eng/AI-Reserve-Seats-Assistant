import { useNavigate } from "react-router-dom";
import Button from "./Button";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleAskAI = () => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      navigate("/student/chat");
    } else {
      navigate("/login");
    }
  };

  const handleLearnMore = () => {
    document.getElementById("about")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-slate-50">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-100 opacity-60 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-100 opacity-60 blur-3xl" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">

        <div className="max-w-4xl">

          {/* Badge */}
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            AI-Powered Student Assistant
          </span>

          {/* Heading */}
          <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Get accurate guidance about

            <span className="block text-blue-600">
              reserved seats in Balochistan.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Ask questions about eligibility, admissions, required documents,
            reserved seats, policies and other official information through
            our AI-powered student assistant.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

            <Button onClick={handleAskAI}>
              Ask AI Assistant
            </Button>

            <Button
              onClick={handleLearnMore}
              className="mt-8 flex w-full justify-center sm:mt-0 sm:w-auto"
            >
              Learn More
            </Button>

          </div>

          {/* Trust information */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
            <span>✓ Official Information</span>
            <span>✓ Student Guidance</span>
            <span>✓ Urdu & English Support</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;