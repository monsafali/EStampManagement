
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PUNJAB from "../../utils/District";
import CustomSelect from "../../components/common/CustomSelect";

const CreateVendor = ({ districtName, districtId }) => {

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      district: districtName || "",
      districtId: districtId || "",
      tehsil: "", // will store tehsilId
      tehsilName: "", // will store tehsilName
      cnic: "",
      licenceNo: "",
      address: "",
      contactno: "",
      imageFile: null,
    },
  });
  const [tehsils, setTehsils] = useState([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    setValue("district", districtName || "");
    setValue("districtId", districtId || "");
    setValue("tehsil", "");
    setValue("tehsilName", "");

    if (districtId) {
      const districtObj = PUNJAB.find(
        (d) => d.districtId === districtId
      );
      setTehsils(districtObj?.tehsils || []);
    } else {
      setTehsils([]);
    }
  }, [districtName, districtId, setValue]);



  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const fd = new FormData();

      // Explicitly match old code's FormData keys
      fd.append("fullname", data.fullname);
      fd.append("username", data.username);
      fd.append("email", data.email);
      fd.append("password", data.password);

      fd.append("district", data.district);    // old code: district name
      fd.append("districtId", data.districtId);

      fd.append("tehsil", data.tehsilName);    // old code: tehsil name
      fd.append("tehsilId", data.tehsil);      // old code: tehsil id

      fd.append("cnic", data.cnic);
      fd.append("licenceNo", data.licenceNo);
      fd.append("address", data.address);
      fd.append("contactno", data.contactno);

      if (data.imageFile) fd.append("imageFile", data.imageFile);

      const res = await axios.post(
        "http://localhost:5000/api/adc/createvendor",
        fd,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data?.success === true) {
        toast.success(res.data.message || "Vendor created successfully");
        reset({
          fullname: "",
          username: "",
          email: "",
          password: "",
          district: districtName || "",
          districtId: districtId || "",
          tehsil: "",
          tehsilName: "",
          cnic: "",
          licenceNo: "",
          address: "",
          contactno: "",
          imageFile: null,
        });

      }

      /* BACKEND VALIDATION FAILURE (no reset) */
      if (res.data?.success === false) {
        toast.error(res.data.message || "Validation failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Vendor already exists or request failed";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="input-group">
          {/* full name */}
          <div className="form-group">
            <input
              className={errors.fullname ? "error" : ""}
              {...register("fullname", { required: "Full name is required" })}
              placeholder=" "
            />
            <label>Full Name</label>
            {errors.fullname && (
              <span className="input-error">{errors.fullname.message}</span>
            )}
          </div>
          {/* user name */}
          <div className="form-group">
            <input
              className={errors.username ? "error" : ""}
              {...register("username", { required: "user name is required" })}
              placeholder=" "
            />
            <label>User Name</label>
            {errors.username && (
              <span className="input-error">{errors.username.message}</span>
            )}
          </div>
          {/* email */}
          <div className="form-group">
            <input
              className={errors.email ? "error" : ""}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
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
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              placeholder=" "
            />


            <label>Password</label>
            {errors.password && <span className="input-error">{errors.password.message}</span>}
          </div>
        </div>
        {/* address */}
        <div className="input-group">
          <div className="form-group col-70">
            <input
              type="text"
              id="address"
              placeholder=" "
              className={errors.address ? "error" : ""}
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters",
                },
              })}
            />
            <label htmlFor="address">Address</label>

            {errors.address && (
              <span className="input-error">
                {errors.address.message}
              </span>
            )}
          </div>
          {/* Tehsil */}
          <div className="form-group col-30">
            <CustomSelect
              name="tehsil"
              label="Tehsil"
              placeholder="Select Tehsil"
              options={tehsils.map((t) => ({
                value: t.tehsilId,
                label: t.tehsilName,
              }))}
              value={watch("tehsil")}
              register={register}
              setValue={setValue}
              required
              error={errors.tehsil?.message}
            />
          </div>
        </div>

        <div className="input-group">
          {/* cnic */}
          <div className="form-group">
            <input
              maxLength="13"
              inputMode="numeric"
              className={errors.cnic ? "error" : ""}
              {...register("cnic", {
                required: "CNIC is required",
                pattern: {
                  value: /^[0-9]{13}$/,
                  message: "CNIC must be exactly 13 digits",
                },
              })}
              placeholder=" "
            />
            <label>CNIC</label>
            {errors.cnic && (
              <span className="input-error">{errors.cnic.message}</span>
            )}
          </div>



          {/* LICENCE */}
          <div className="form-group">
            <input
              className={errors.licenceNo ? "error" : ""}
              {...register("licenceNo", { required: "Licence number is required" })}
              placeholder=" "
            />
            <label>Licence No</label>
            {errors.licenceNo && <span className="input-error">{errors.licenceNo.message}</span>}
          </div>
          {/* CONTACT */}
          <div className="form-group">
            <input
              inputMode="numeric"
              className={errors.contactno ? "error" : ""}
              {...register("contactno", {
                required: "Contact number is required",
              })}
              placeholder=" "
            />
            <label>Contact No</label>
            {errors.contactno && <span className="input-error">{errors.contactno.message}</span>}
          </div>
        </div>
        {/* Image Upload */}
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            className={errors.imageFile ? "error" : ""}
            onChange={(e) => {
              setValue("imageFile", e.target.files[0], {
                shouldValidate: true,
              });
            }}
          />

          {errors.imageFile && (
            <span className="input-error">{errors.imageFile.message}</span>
          )}

        </div>
        {/* Hidden fields for district & tehsilName */}
        {/*     
        <input type="hidden" {...register("district")} />
        <input type="hidden" {...register("districtId")} />
        <input type="hidden" {...register("tehsilName")} /> */}


        <button type="submit" className="form-btn sliding-overlay-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Vendor"}
        </button>
      </form >
    </>
  );
};

export default CreateVendor;
