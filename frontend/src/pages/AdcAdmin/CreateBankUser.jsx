import React, { useState } from "react";
import axios from "axios";


const CreateBankUser = () => {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/adc/createBankUser",
        form,
        { withCredentials: true }
      );

      setMessage(res.data.message || "Bank User Created Successfully!");
      setForm({
        fullname: "",
        username: "",
        email: "",
        password: "",
        district: "",
      });
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      {
        message && (
          <p className="create-user-message">{message}</p>
        )
      }
      <form
        onSubmit={handleSubmit}
        className="form-container"
      >
        <div className="input-group">
          <div className="form-group">
            <input
              type="text"
              name="fullname"
              id="fullname"
              placeholder=""
              value={form.fullname}
              onChange={handleChange}
              required
            />
            <label htmlFor="fullname">Full Name</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="username"
              id="username"
              placeholder=""
              value={form.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="username">User Name</label>
          </div>
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=""
            value={form.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            id="password"
            placeholder=""
            value={form.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <button
          disabled={loading}
          className="form-btn"
        >
          {loading ? "Creating..." : "Create Bank User"}
        </button>
      </form>
    </>
  );
};

export default CreateBankUser;
