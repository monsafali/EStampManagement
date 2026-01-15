import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordInput = ({
    name,
    label = "Password",
    placeholder = " ",
    error,
    register,
    rules = {},

    /*  for useState based inputs */
    value,
    onChange,

    className = "",
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputProps = register
        ? register(name, rules) // react-hook-form
        : { value, onChange }; // useState

    return (
        <div className="form-group">
            <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className={`${error ? "error" : ""} ${className}`}
                {...inputProps}
            />

            <label>{label}</label>

            <span
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
            >
                {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                ) : (
                    <VisibilityIcon fontSize="small" />
                )}
            </span>

            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default PasswordInput;
