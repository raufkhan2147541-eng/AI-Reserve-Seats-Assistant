const InformationSection = () => {
  return (
    <section 
    id="about"
    className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Reliable Student Guidance
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Information you can understand and trust
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              The AI assistant is designed to help students find information
              from the official knowledge provided by the Directorate Reserve
              Seats of Balochistan.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600">
              Instead of searching through lengthy documents manually,
              students can simply ask a question and receive relevant
              guidance in an easy-to-understand format.
            </p>

            {/* Points */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Official Knowledge Base
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Answers are generated using the documents and information
                    provided by the administration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Source References
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Relevant answers can include the source document and page
                    information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Simple Student Experience
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Students can ask questions naturally without having to
                    understand complicated search systems.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Information Card */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                  🤖
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    AI Student Assistant
                  </h3>

                  <p className="text-sm text-slate-500">
                    Directorate Reserve Seats
                  </p>
                </div>
              </div>

              {/* Example Question */}
              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Student Question
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  What documents are required to apply for a reserved seat?
                </p>
              </div>

              {/* Example Answer */}
              <div className="mt-4 rounded-2xl bg-blue-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                  AI Assistant
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Based on the available official information, the required
                  documents are listed in the relevant admission guidelines.
                  The assistant can also provide the source document and page
                  reference.
                </p>
              </div>

              {/* Source */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span>📄</span>
                <span>Official Document • Page Reference</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InformationSection;