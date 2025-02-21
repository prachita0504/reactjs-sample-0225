import React, { useState, useEffect } from "react";

const predefinedAvatars = [
  "https://cdn-icons-png.flaticon.com/512/147/147144.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922521.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922656.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922565.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922506.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922599.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922602.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922606.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922622.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922630.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922662.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922688.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922695.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922711.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922725.png",
  "https://cdn-icons-png.flaticon.com/512/2922/2922738.png"
];

const UserSettings = () => {
  const [selectedOption, setSelectedOption] = useState("profile");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    setProfilePic(localStorage.getItem("profilePic") || "/default-avatar.png");
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setProfilePic(avatar);
    localStorage.setItem("profilePic", avatar);
  };

  const handleUsernameChange = () => {
    if (!username.trim()) {
      alert("Username cannot be empty!");
      return;
    }
    localStorage.setItem("username", username);
    alert("Username updated successfully!");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">User Settings</h2>
        <ul className="space-y-2">
          <li
            className={`p-2 cursor-pointer hover:bg-gray-700 rounded ${selectedOption === "profile" ? "bg-gray-700" : ""}`}
            onClick={() => setSelectedOption("profile")}
          >
            Edit Profile Picture
          </li>
          <li
            className={`p-2 cursor-pointer hover:bg-gray-700 rounded ${selectedOption === "username" ? "bg-gray-700" : ""}`}
            onClick={() => setSelectedOption("username")}
          >
            Edit Username
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 p-6">
        {selectedOption === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Edit Profile Picture</h2>
            <div className="flex justify-center mb-4">
              <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover" />
            </div>
            <label className="block w-fit mx-auto bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
              Choose File
              <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
            </label>
            <h3 className="text-lg font-bold mt-4">Or Select an Avatar</h3>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {predefinedAvatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt="Avatar"
                  className={`w-16 h-16 rounded-full cursor-pointer border-2 transition ${
                    profilePic === avatar ? "border-blue-500" : "border-transparent"
                  } hover:border-blue-500`}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedOption === "username" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Edit Username</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleUsernameChange}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
