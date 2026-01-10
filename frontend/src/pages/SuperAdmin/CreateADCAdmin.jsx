import PUNJAB from "../../utils/District";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Orbit from "../../components/common/Orbit";

const CreateADCAdmin = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      district: "",
      districtId: "",
      imageFile: null,
    },
  });

  const [loading, setLoading] = useState(false);
  const [districts, setDistricts] = useState([]);

  // Load districts
  useEffect(() => {
    setDistricts(PUNJAB.map((d) => d));
  }, []);

  // Handle district change (ID → name mapping)
  const handleDistrictChange = (e) => {
    const selected = districts.find(
      (d) => d.districtId.toString() === e.target.value
    );

    setValue("districtId", selected?.districtId || "");
    setValue("district", selected?.districtName || "");
  };

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("fullname", data.fullname);
      fd.append("username", data.username);
      fd.append("email", data.email);
      fd.append("password", data.password);
      fd.append("district", data.district);
      fd.append("districtId", data.districtId);
      fd.append("imageFile", data.imageFile);

      const res = await axios.post(
        "http://localhost:5000/api/admin/createADCAdmin",
        fd,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data?.success === true) {
        toast.success(res.data.message || "ADC Admin created successfully");
        reset(); // reset only on success
      } else {
        toast.error(res.data?.message || "Validation failed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">

        <div className="input-group">
          {/* FULL NAME */}
          <div className="form-group">
            <input
              placeholder=" "
              className={errors.fullname ? "error" : ""}
              {...register("fullname", {
                required: "Full name is required",
              })}
            />
            <label>Full Name</label>
            {errors.fullname && (
              <span className="input-error">{errors.fullname.message}</span>
            )}
          </div>

          {/* USERNAME */}
          <div className="form-group">
            <input
              placeholder=" "
              className={errors.username ? "error" : ""}
              {...register("username", {
                required: "Username is required",
              })}
            />
            <label>User Name</label>
            {errors.username && (
              <span className="input-error">{errors.username.message}</span>
            )}
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <input
              type="email"
              placeholder=" "
              className={errors.email ? "error" : ""}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <label>Email</label>
            {errors.email && (
              <span className="input-error">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="input-group">
          {/* PASSWORD */}


          {/* DISTRICT */}
          <div className="form-group col-30">
            <select
              value={watch("districtId")}
              onChange={handleDistrictChange}
              className={errors.districtId ? "error" : ""}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.districtId} value={d.districtId}>
                  {d.districtName}
                </option>
              ))}
            </select>
            {errors.districtId && (
              <span className="input-error">District is required</span>
            )}
          </div>
          <div className="form-group col-70">
            <input
              type="password"
              placeholder=" "
              className={errors.password ? "error" : ""}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
            />
            <label>Password</label>
            {errors.password && (
              <span className="input-error">{errors.password.message}</span>
            )}
          </div>
        </div>

        {/* IMAGE */}
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            className={errors.imageFile ? "error" : ""}
            {...register("imageFile", {
              required: "Photo is required",
            })}
            onChange={(e) => setValue("imageFile", e.target.files[0])}
          />
          <label>Upload Photo</label>
          {errors.imageFile && (
            <span className="input-error">{errors.imageFile.message}</span>
          )}
        </div>

        <button type="submit" className="form-btn sliding-overlay-btn" disabled={loading}>
          {loading ? "Creating..." : "Create ADC Admin"}
        </button>
      </form>

    </div>


  );
};

export default CreateADCAdmin;
