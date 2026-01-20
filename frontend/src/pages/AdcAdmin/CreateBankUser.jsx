import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
     
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';

import PasswordInput from "../../components/common/PasswordInput";
import { API_BASE_URL } from "../../api";

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
      const res = await API_BASE_URL.post(
        `api/adc/createBankUser`,
        data,
        { withCredentials: true },
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
        <div className="form-group input-with-icons">
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
          <span className="input-icon"><MailOutlineOutlinedIcon/></span>
          {errors.email && (
            <span className="input-error">{errors.email.message}</span>
          )}
        </div>
        {/* PASSWORD */}
        <PasswordInput
          name="password"
          label="Password"
          register={register}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters required",
            },
          }}
          error={errors.password?.message}
        />
      </div>

      <button
        type="submit"
        className="form-btn sliding-overlay-btn"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Bank User"}
      </button>
    </form>
  );
};

export default CreateBankUser;
















