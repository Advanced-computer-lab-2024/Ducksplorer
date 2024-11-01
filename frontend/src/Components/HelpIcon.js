import HelpIcon from "@mui/icons-material/Help";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

import "./HelpIcon.css";

const Help = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem("user");
    const user = JSON.parse(userJson);
    const userName = user.username;
    if (!userName) {
        message.error("Username not found in user data.");
        return;
    }

    try {
      const response = await axios.post("http://localhost:8000/complaint/", {
        title: formData.title,
        body: formData.body,
        date: formData.date,
        tourist: userName,
      });
      console.log(response.data);

      if (response.status === 201) {
        message.success("Complaint filed successfully");
        // Reset form data here
        resetForm();
        setIsOpen(false);
      } else {
        console.log(response.date);
        message.error("Failed to add complaint");
      }
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      body: "",
      date: "",
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false); // Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef}>
      <div className="floating-icon" onClick={toggleMenu}>
        <HelpIcon color="#4CAF50" />
      </div>
      {isOpen && (
        <div className="popup-menu">
          <h3>File a Complaint</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                type="text"
                placeholder="Enter title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </label>
            <label>
              Body:
              <textarea
                placeholder="Enter complaint details"
                rows="3"
                name="body"
                value={formData.body}
                onChange={handleChange}
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                placeholder="Date"
                value={formData.date}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Help;
