// import React, { useState } from "react";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";

// const CreateBankUser = () => {
//   const [form, setForm] = useState({
//     fullname: "",
//     username: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Handle input change
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Submit Handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/adc/createBankUser",
//         form,
//         { withCredentials: true }
//       );

//       setMessage(res.data.message || "Bank User Created Successfully!");
//       setForm({
//         fullname: "",
//         username: "",
//         email: "",
//         password: "",
//         district: "",
//       });
//     } catch (err) {
//       console.log(err);
//       setMessage(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>

//       {
//         message && (
//           <p className="create-user-message">{message}</p>
//         )
//       }
//       <form
//         onSubmit={handleSubmit}
//         className="form-container"
//       >
//         <div className="input-group">
//           <div className="form-group">
//             <input
//               type="text"
//               name="fullname"
//               id="fullname"
//               placeholder=""
//               value={form.fullname}
//               onChange={handleChange}
//               required
//             />
//             <label htmlFor="fullname">Full Name</label>
//           </div>
//           <div className="form-group">
//             <input
//               type="text"
//               name="username"
//               id="username"
//               placeholder=""
//               value={form.username}
//               onChange={handleChange}
//               required
//             />

//             <label htmlFor="username">User Name</label>
//           </div>
//         </div>

//         <div className="form-group">
//           <input
//             type="email"
//             name="email"
//             id="email"
//             placeholder=""
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//           <label htmlFor="email">Email</label>
//         </div>

//         <div className="form-group">
//           <input
//             type="password"
//             name="password"
//             id="password"
//             placeholder=""
//             value={form.password}
//             onChange={handleChange}
//             required
//           />
//           <label htmlFor="password">Password</label>
//         </div>
//         <button
//           disabled={loading}
//           className="form-btn"
//         >
//           {loading ? "Creating..." : "Create Bank User"}
//         </button>
//       </form>
//     </>
//   );
// };

// export default CreateBankUser;


import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateBankUser = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (loading) return; // extra safety
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/adc/createBankUser",
        data,
        { withCredentials: true }
      );

      if (res.data?.success === true) {
        toast.success(res.data.message || "Bank user created successfully");
        reset(); // reset only on success
      } else {
        toast.error(res.data?.message || "Validation failed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Bank user already exists or request failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="form-container">

      <div className="input-group">
        {/* FULL NAME */}
        <div className="form-group">
          <input
            className={errors.fullname ? "error" : ""}
            {...register("fullname", {
              required: "Full name is required",
            })}
            placeholder=" "
          />
          <label>Full Name</label>
          {errors.fullname && (
            <span className="input-error">{errors.fullname.message}</span>
          )}
        </div>

        {/* USERNAME */}
        <div className="form-group">
          <input
            className={errors.username ? "error" : ""}
            {...register("username", {
              required: "User name is required",
            })}
            placeholder=" "
          />
          <label>User Name</label>
          {errors.username && (
            <span className="input-error">{errors.username.message}</span>
          )}
        </div>
      </div>



      <div className="input-group">
        {/* EMAIL */}
        <div className="form-group">
          <input

            className={errors.email ? "error" : ""}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            placeholder=" "
          />
          <label>Email</label>
          {errors.email && (
            <span className="input-error">{errors.email.message}</span>
          )}
        </div>

        {/* PASSWORD */}

        <div className="form-group">
          <input
            type="password"
            className={errors.password ? "error" : ""}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
            placeholder=" "
          />
          <label>Password</label>
          {errors.password && (
            <span className="input-error">{errors.password.message}</span>
          )}
        </div>
      </div>


      <button
        type="submit"
        className="form-btn"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Bank User"}
      </button>
    </form>
  );
};

export default CreateBankUser;
















