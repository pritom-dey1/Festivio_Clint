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

      const res = await axios.put("http://localhost:5000/api/auth/update", {
        name,
        photoURL: photo,
      }, { withCredentials: true });

      setUser(res.data.user);  // update frontend auth state
      close();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        <label className="block text-sm mb-1">Name</label>
        <input
          className="w-full border px-3 py-2 rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm mb-1">Photo URL</label>
        <input
          className="w-full border px-3 py-2 rounded mb-3"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
