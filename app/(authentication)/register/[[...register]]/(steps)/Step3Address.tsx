// app/register/steps/Step3Address.tsx
export default function Step3Address({ back }: { back: () => void }) {
    return (
      <div className="p-4 bg-white dark:bg-gray-950 rounded-lg shadow-lg">
        <h5 className="text-lg font-bold dark:text-white">Are you living in a nice area?</h5>
        <p className="text-slate-400 mb-4">One thing I love about the later sunsets is the chance to go for a walk through the neighborhood woods before dinner</p>
        <input
          type="text"
          placeholder="Street Name"
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 dark:bg-gray-950 dark:text-white"
        />
        <input
          type="number"
          placeholder="Street No"
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 dark:bg-gray-950 dark:text-white"
        />
        <input
          type="text"
          placeholder="City"
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 dark:bg-gray-950 dark:text-white"
        />
        <select className="w-full p-2 mb-4 rounded-lg border border-gray-300 dark:bg-gray-950 dark:text-white">
          <option value="Argentina">Argentina</option>
          <option value="Albania">Albania</option>
          <option value="Algeria">Algeria</option>
        </select>
        <div className="flex gap-4">
          <button
            onClick={back}
            className="px-6 py-3 bg-gradient-to-tl from-gray-400 to-gray-100 text-slate-800 rounded-lg hover:scale-105 transition-transform"
          >
            Prev
          </button>
          <button
            type="submit"
            className="ml-auto px-6 py-3 bg-gradient-to-tl from-gray-900 to-slate-800 text-white rounded-lg hover:scale-105 transition-transform"
          >
            Send
          </button>
        </div>
      </div>
    );
  }