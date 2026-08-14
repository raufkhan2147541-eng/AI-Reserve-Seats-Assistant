const features = [
  {
    icon: "🎓",
    title: "Eligibility Guidance",
    description:
      "Get clear information about eligibility criteria and reserved seat requirements.",
  },
  {
    icon: "📄",
    title: "Required Documents",
    description:
      "Find out which documents are required for applications and admissions.",
  },
  {
    icon: "📚",
    title: "Admission Information",
    description:
      "Ask questions about admission procedures, policies and important requirements.",
  },
  {
    icon: "🔎",
    title: "Official Information",
    description:
      "Get answers based on the official information provided by the Directorate.",
  },
  {
    icon: "🌐",
    title: "Urdu & English",
    description:
      "Ask questions in Urdu or English and receive easy-to-understand guidance.",
  },
  {
    icon: "📌",
    title: "Source-Based Answers",
    description:
      "View the document source and page information behind relevant AI answers.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Student Support
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything students need in one place
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Our AI assistant helps students quickly find reliable information
            about reserved seats, admissions, eligibility and official
            requirements.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl transition group-hover:bg-blue-600">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;