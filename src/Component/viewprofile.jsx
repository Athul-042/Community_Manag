import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    door_no: "",
    floor_no: "",
    apartment: "",
    family_details: "",
    family_members: "",
    communication: "",
    worker_type: "",
    work: "",
    seperate_work: "",
    time: "",
    terms: false,
    status: "",
  });

  // 🔹 Fetch user data on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/profile/${userId}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          // ✅ Fill all fields dynamically
          setFormData({
            firstname: data.firstname || "",
            lastname: data.lastname || "",
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || "",
            door_no: data.door_no || "",
            floor_no: data.floor_no || "",
            apartment: data.apartment || "",
            family_details: data.family_details || "",
            family_members: data.family_members?.join(", ") || "",
            communication: data.communication || "",
            worker_type: data.worker_type || "",
            work: data.work || "",
            seperate_work: data.seperate_work || "",
            time: data.time || "",
            terms: data.terms || false,
            status: data.status || "",
          });
        } else {
          alert(data.error || "Failed to fetch user");
        }
      } catch (err) {
        console.error(err);
        alert("Server error. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    // Convert family_members back to array
    const updatedData = {
      ...formData,
      family_members: formData.family_members
        ? formData.family_members.split(",").map((m) => m.trim())
        : [],
    };

    try {
      const res = await fetch(`http://localhost:5000/user/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Profile updated successfully!");
        setFormData({
          ...updatedData,
          family_members: updatedData.family_members.join(", "),
        }); // reflect updated data immediately
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  if (loading) return <p className="text-center text-lg mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-300 px-3 py-1 rounded">
        Back
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded ml-4"
        onClick={() => {
          localStorage.removeItem("userId");
          sessionStorage.clear();
          navigate("/login");
        }}
        style={{ width: "300px" }}
      >
        Logout
      </button>

      <main className="mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

        <form className="bg-white p-6 rounded-lg shadow-md max-w-2xl" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div className="mb-4" key={key}>
              <label className="block text-gray-700 mb-1 capitalize">
                {key.replace("_", " ")}
              </label>
              {key === "terms" ? (
                <input
                  type="checkbox"
                  name={key}
                  checked={formData[key]}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold transition"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default ViewProfile;
