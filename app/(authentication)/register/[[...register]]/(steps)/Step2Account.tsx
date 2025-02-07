// app/register/steps/Step2Account.tsx
export default function Step2Account({ next, back }: { next: () => void; back: () => void }) {
    return (
      <div className="p-4 bg-white dark:bg-gray-950 rounded-lg shadow-lg">
        <h5 className="text-lg font-bold dark:text-white">What are you doing?</h5>
        <p className="text-slate-400 mb-4">Give us more details about you.</p>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="dark:text-white">Design</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="dark:text-white">Code</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="dark:text-white">Develop</span>
          </label>
        </div>
        <div className="flex gap-4">
          <button
            onClick={back}
            className="px-6 py-3 bg-gradient-to-tl from-gray-400 to-gray-100 text-slate-800 rounded-lg hover:scale-105 transition-transform"
          >
            Prev
          </button>
          <button
            onClick={next}
            className="ml-auto px-6 py-3 bg-gradient-to-tl from-gray-900 to-slate-800 text-white rounded-lg hover:scale-105 transition-transform"
          >
            Next
          </button>
        </div>
      </div>
    );
  }