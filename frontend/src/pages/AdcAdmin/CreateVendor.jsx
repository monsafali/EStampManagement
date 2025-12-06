


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const CreateVendor = ({ districtName, districtId }) => {
//   const [form, setForm] = useState({
//     fullname: "",
//     username: "",
//     email: "",
//     password: "",
//     district: districtName || "", // auto-fill district
//     tehsil: "",
//     cnic: "",
//     licenceNo: "",
//     address: "",
//     imageFile: null,
//   });

//   const [tehsils, setTehsils] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Update district in form if districtName changes
//   useEffect(() => {
//     setForm((prev) => ({ ...prev, district: districtName || "" }));
//   }, [districtName]);

//   // Handle input changes
//   const handleChange = (e) => {
//     if (e.target.name === "imageFile") {
//       setForm({ ...form, imageFile: e.target.files[0] });
//     } else {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     }
//   };

//   // Fetch tehsils for the given districtId
//   const fetchTehsils = async (districtId) => {
//     if (!districtId) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/districts/tehsils/${districtId}`
//       );
//       setTehsils(res.data);
//     } catch (err) {
//       console.log("Error loading tehsils:", err);
//       setTehsils([]);
//     }
//   };

//   useEffect(() => {
//     fetchTehsils(districtId);
//   }, [districtId]);

//   // Submit handler
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setMessage("");

//   try {
//     // Convert form object to FormData
//     const fd = new FormData();
//     fd.append("fullname", form.fullname);
//     fd.append("username", form.username);
//     fd.append("email", form.email);
//     fd.append("password", form.password);
//     fd.append("district", form.district);
//     fd.append("districtId", form.districtId);
//     fd.append("tehsil", form.tehsil);
//     fd.append("cnic", form.cnic);
//     fd.append("licenceNo", form.licenceNo);
//     fd.append("address", form.address);

//     // Append file (IMPORTANT)
//     fd.append("imageFile", form.imageFile);

//     const res = await axios.post(
//       "http://localhost:5000/api/adc/createvendor",
//       fd,
//       {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     setMessage(res.data.message || "Vendor Created Successfully!");

//     // Reset form
//     setForm({
//       fullname: "",
//       username: "",
//       email: "",
//       password: "",
//       district: districtName || "",
//       districtId: "",
//       tehsil: "",
//       cnic: "",
//       licenceNo: "",
//       address: "",
//       imageFile: null,
//     });

//     setTehsils([]);
//   } catch (err) {
//     console.log(err);
//     setMessage(err.response?.data?.message || "Something went wrong.");
//   } finally {
//     setLoading(false);
//   }
// };





//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Create Vendor</h1>

//       {message && (
//         <p className="mb-3 text-white p-2 rounded bg-blue-500">{message}</p>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="space-y-4 border p-4 rounded shadow"
//       >
//         <input
//           type="text"
//           name="fullname"
//           placeholder="Full Name"
//           value={form.fullname}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={form.username}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         {/* Tehsil Dropdown */}
//         <select
//           name="tehsil"
//           value={form.tehsil}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//           disabled={!tehsils.length}
//         >
//           <option value="">Select Tehsil</option>
//           {tehsils.map((t) => (
//             <option key={t.Id} value={t.Name}>
//               {t.Name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           name="cnic"
//           placeholder="CNIC"
//           value={form.cnic}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <input
//           type="text"
//           name="licenceNo"
//           placeholder="Licence No"
//           value={form.licenceNo}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <input
//           type="text"
//           name="address"
//           placeholder="Address"
//           value={form.address}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />

//         <input
//           type="file"
//           name="imageFile"
//           accept="image/*"
//           capture="environment"
//           onChange={handleChange}
//           className="p-2 border rounded"
//           required
//         />

//         <button
//           disabled={loading}
//           className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
//         >
//           {loading ? "Creating..." : "Create Vendor"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateVendor;



import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateVendor = ({ districtName, districtId }) => {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    district: districtName || "",
    tehsil: "",
    cnic: "",
    licenceNo: "",
    address: "",
    contactno: "",
    imageFile: null,
  });

  const [tehsils, setTehsils] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Update district when districtName changes from parent
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      district: districtName || "",
    }));
  }, [districtName]);

  // Handle Input Changes
  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setForm({ ...form, imageFile: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Fetch Tehsils based on districtId
  const fetchTehsils = async (districtId) => {
    if (!districtId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/districts/tehsils/${districtId}`
      );
      setTehsils(res.data);
    } catch (err) {
      console.log("Error loading tehsils:", err);
      setTehsils([]);
    }
  };

  useEffect(() => {
    fetchTehsils(districtId);
  }, [districtId]);

  // Submit Vendor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("fullname", form.fullname);
      fd.append("username", form.username);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("district", districtName); // correct district
      fd.append("districtId", districtId); // correct district ID
      fd.append("tehsil", form.tehsil);
      fd.append("cnic", form.cnic);
      fd.append("licenceNo", form.licenceNo);
      fd.append("address", form.address);
      fd.append("contactno", form.contactno);

      // File upload
      fd.append("imageFile", form.imageFile);

      const res = await axios.post(
        "http://localhost:5000/api/adc/createvendor",
        fd,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message || "Vendor Created Successfully!");

      // Reset form
      setForm({
        fullname: "",
        username: "",
        email: "",
        password: "",
        district: districtName || "",
        tehsil: "",
        cnic: "",
        licenceNo: "",
        address: "",
        contactno: "",
        imageFile: null,
      });

      setTehsils([]);
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Vendor</h1>

      {message && (
        <p className="mb-3 text-white p-2 rounded bg-blue-500">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-4 rounded shadow"
      >
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Tehsil Dropdown */}
        <select
          name="tehsil"
          value={form.tehsil}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          disabled={!tehsils.length}
        >
          <option value="">Select Tehsil</option>
          {tehsils.map((t) => (
            <option key={t.Id} value={t.Name}>
              {t.Name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="cnic"
          placeholder="CNIC"
          value={form.cnic}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="licenceNo"
          placeholder="Licence No"
          value={form.licenceNo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="contactno"
          placeholder="contactno"
          value={form.contactno}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {loading ? "Creating..." : "Create Vendor"}
        </button>
      </form>
    </div>
  );
};

export default CreateVendor;
