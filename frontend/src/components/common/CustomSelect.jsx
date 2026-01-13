import { useEffect, useRef, useState } from "react";
import "../../styles/components/customSelect.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const CustomSelect = ({
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  error,
  register,
  setValue,
  required = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((o) => o.value === value);

  const field = register
    ? register(name, {
        required: required ? `${label || name} is required` : false,
      })
    : null;

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // keep selected option highlighted when opened
  useEffect(() => {
    if (open) {
      setHighlightedIndex(
        options.findIndex((o) => o.value === value)
      );
    }
  }, [open, options, value]);

  //  CENTRAL VALUE HANDLER (UNCHANGED)
  const handleSelect = (opt) => {
    if (setValue) {
      setValue(name, opt.value, {
        shouldValidate: true,
        shouldDirty: true,
      });

      if (name === "tehsil") {
        setValue("tehsilName", opt.label, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } else if (field) {
      field.onChange({
        target: { name, value: opt.value },
      });
    } else if (onChange) {
      onChange(opt.value);
    }

    setOpen(false);
    setHighlightedIndex(-1); // CRITICAL FIX
  };

  return (
    <div ref={wrapperRef}>
      {label && <label className="custom-label">{label}</label>}

      <div className="custom-select">
        <div
          className={`select-trigger ${error ? "error" : ""}`}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={open}
          aria-disabled={disabled}
          onClick={() => !disabled && setOpen((p) => !p)}
          onKeyDown={(e) => {
            if (disabled) return;

            switch (e.key) {
              case "Enter":
                e.preventDefault();
                if (open && highlightedIndex >= 0) {
                  handleSelect(options[highlightedIndex]);
                } else {
                  setOpen(true);
                }
                break;

              case " ":
                e.preventDefault();
                setOpen((p) => !p);
                break;

              case "ArrowDown":
                e.preventDefault();
                setOpen(true);
                setHighlightedIndex((i) =>
                  Math.min(i + 1, options.length - 1)
                );
                break;

              case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((i) =>
                  Math.max(i - 1, 0)
                );
                break;

              case "Escape":
                setOpen(false);
                setHighlightedIndex(-1);
                break;

              default:
                break;
            }
          }}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <KeyboardArrowDownIcon
            className={`arrow ${open ? "rotate" : ""}`}
          />
        </div>

        {open && (
          <ul className="select-options" role="listbox">
            {options.map((opt, i) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={highlightedIndex === i}
                className={highlightedIndex === i ? "active" : ""}
                onMouseEnter={() => setHighlightedIndex(i)}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {register && <input type="hidden" {...field} />}
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default CustomSelect;
