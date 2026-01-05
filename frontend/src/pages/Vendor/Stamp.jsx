import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Stamp() {

  const { user } = useContext(AuthContext);
  const [geoTehsil, setGeoTehsil] = useState("");
  const [geoError, setGeoError] = useState("");


  //   Stamptype: "Low Denomination",
  //   StampAmount: "",
  //   Description: "",
  //   Applicant: "",
  //   cnic: "",
  //   Relation: "",
  //   Relation_Name: "",
  //   agent: "",
  //   email: "",
  //   phone: "",
  //   address: "",
  //   reason: "",
  //   vendorInfo: "",
  // });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Stamptype: "Low Denomination",
      StampAmount: "",
      Description: "",
      Applicant: "",
      cnic: "",
      Relation: "",
      Relation_Name: "",
      agent: "",
      email: "",
      phone: "",
      address: "",
      reason: "",
      vendorInfo: "",
    },
  });



  const descriptionPrices = {
    "AGREEMENT OR MEMORANDUM OF AN AGREEMENT - 5(ccc)": 100,
    "PARTNERSHIP - 46(a)": 200,
    "AFFIDAVIT - 4": 300,
    "ADOPTION DEED - 3": 100,
    "TRANSFER - 62(c)": 200,
    "POWER OF ATTORNEY - 48(c)": 300,
    Divorced: 300,
  };

  const relationOptions = ["", "S/O", "D/O", "W/O", "F/O", "Widow/Of"];
  const selectedDescription = watch("Description");
  // auto update stamp amount
  useEffect(() => {
    setValue("StampAmount", descriptionPrices[selectedDescription] || "");
  }, [selectedDescription, setValue]);
  // vendor info + geolocation
  useEffect(() => {
    setValue(
      "vendorInfo",
      `${user.fullname} | ${user.licenceNo} | ${user.address}`
    );

    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const baseUrl = import.meta.env.VITE_LOCATION_API;
          const res = await fetch(`${baseUrl}&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          const address = data.address || {};
          const tehsil =
            address.county ||
            address.city ||
            address.town ||
            address.village ||
            "";

          setGeoTehsil(tehsil);
        } catch {
          setGeoError("Failed to fetch location.");
        }
      },
      (err) => setGeoError(err.message)
    );
  }, [setValue, user]);



  const onSubmit = async (data) => {
    if (!geoTehsil) {
      toast.error("Unable to determine your location.");
      return;
    }

    if (geoTehsil.toUpperCase() !== user.tehsil.toUpperCase()) {
      toast.error(
        `Out of Tehsil! Assigned: ${user.tehsil}, Current: ${geoTehsil}`
      );
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/stamp/generate-pdf",
        data,
        { responseType: "blob", withCredentials: true }
      );

      const file = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "stamp.pdf";
      link.click();

      toast.success("Stamp PDF generated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Error generating PDF");
    }
  };




  // yh
  return (
    <div>

      {geoError && <p className="error">{geoError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        {/* Applicant */}
        <div className="input-group">
          <div className="form-group">
            <input
              className={errors.Applicant ? "error" : ""}
              {...register("Applicant", { required: "Applicant is required" })}
              placeholder=" "
            />
            <label>Applicant</label>
            {errors.Applicant && (
              <span className="input-error">{errors.Applicant.message}</span>
            )}
          </div>
          {/* CNIC */}
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
        </div>
        {/* Relation Name */}
        <div className="input-group ">
          <div className="form-group col-70">
            <input
              className={errors.Relation_Name ? "error" : ""}
              {...register("Relation_Name", {
                required: "Relation name required",
              })}
              placeholder=" "
            />
            <label>Relation Name</label>
            {errors.Relation_Name && (
              <span className="input-error">
                {errors.Relation_Name.message}
              </span>
            )}
          </div>
          {/* Relation */}
          <div className="form-group col-30">
            <select
              className={errors.Relation ? "error" : ""}
              {...register("Relation", {
                required: "Relation is required",
              })}
            >
              <option value="">Select Relation</option>
              {relationOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.Relation && (
              <span className="input-error">{errors.Relation.message}</span>
            )}
          </div>
        </div>
        {/* Agent + Email */}
        <div className="input-group">
          <div className="form-group">
            <input
              className={errors.agent ? "error" : ""}
              {...register("agent", {
                required: "Agent name is required",
                minLength: {
                  value: 3,
                  message: "Agent name must be at least 3 characters",
                },
              })}
              placeholder=" "
            />
            <label className={errors.agent ? "label-error" : ""}>
              Agent
            </label>
            {errors.agent && (
              <span className="input-error">{errors.agent.message}</span>
            )}
          </div>
          <div className="form-group">
            <input
              className={errors.email ? "error" : ""}
              {...register("email",
                {
                  required: "emai number is required",
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
        </div>

        <div className="input-group">
          {/* Phone */}
          {/* Address */}
          <div className="form-group">
            <input
              className={errors.phone ? "error" : ""}
              {...register("phone", {
                required: "Phone number is required",
              })} placeholder=" " />
            <label>Phone</label>
            {errors.phone && (
              <span className="input-error">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              className={errors.address ? "error" : ""}
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 10,
                  message: "Address is too short",
                },
              })}
              placeholder=" " />
            <label>Address</label>
            {errors.address && (
              <span className="input-error">{errors.address.message}</span>
            )}
          </div>
        </div>

        {/* Reason */}
        <div className="form-group">
          <textarea
            className={errors.reason ? "error" : ""}
            {...register("reason", { required: "Reason is required" })}
            placeholder=" "
          />
          <label>Reason</label>
          {errors.reason && (
            <span className="input-error">{errors.reason.message}</span>
          )}
        </div>

        {/*Stamp Amount + Description */}
        <div className="input-group">
          <div className="form-group col-70">
            <input readOnly {...register("StampAmount")} placeholder=" " />
            <label>Stamp Amount</label>
          </div>

          <div className="form-group col-30">
            <select
              className={errors.Description ? "error" : ""}
              {...register("Description", {
                required: "Description required",
              })}
            >
              <option value="">Select Description</option>
              {Object.keys(descriptionPrices).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Stamp Type */}
        <div className="form-group">
          <input readOnly {...register("Stamptype")} />
          <label>Stamp Type</label>
        </div>


        {/* Vendor Info */}
        <div className="form-group">
          <input readOnly {...register("vendorInfo")} />
          <label>Vendor Info</label>
        </div>


        <button type="submit" className="form-btn">
          Download Stamp PDF
        </button>
      </form>

    </div>
  );
}

