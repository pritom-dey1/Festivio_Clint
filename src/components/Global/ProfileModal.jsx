import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/Authcontext";

export default function ProfileModal({ close }) {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        "https://server-1kb7.onrender.com/api/auth/update",
        { name, photoURL: photo },
        { withCredentials: true }
      );

      setUser(res.data.user);
      close();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] px-3">
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all">

        <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">
          Edit Profile
        </h2>

        {/* NAME */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Name
          </label>
          <input
            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* PHOTO URL */}
        <div className="mb-2">
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Photo URL
          </label>
          <input
            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-100 px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300
                       dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700
                       disabled:opacity-60 transition-all"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
