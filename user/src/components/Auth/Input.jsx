import React from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Input = ({
  label,
  id,
  placeholder,
  value,
  error,
  keyboardType,
  showPassword,
  setShowPassword,
  handleChange,
  name,
  errorMessage,
  isPassword,
  important = true,
  multiline = false,
}) => {
  return (
    <div className="flex-col w-full gap-1">
      <label
        htmlFor={id}
        className="text-gray-700 font-main  font-medium text-sm"
      >
        {label} {important && <span className="text-red-500">*</span>}
      </label>

      {/* 
        Container adjustments:
        If multiline, we apply a min-height (100px) and a max-height (140px). 
        Once the text exceeds 140px, the input will become internally scrollable.
      */}
      <div
        className={`flex gap-2 flex-row justify-center items-center  w-full bg-transparent border ${
          error ? "border-red-500" : "border-gray-200"
        } rounded-md px-4 ${
          multiline
            ? "min-h-25  max-h-35 py-3 items-start"
            : "h-12 items-center"
        }`}
      >
        <input
          name={name}
          id={id}
          className={`flex-1 bg-transparent  outline-0 placeholder:text-[#9CA3AF] ${
            multiline ? "w-full" : "h-full"
          } ${error ? "text-red-500" : "text-gray-900"} font-extralight`}
          placeholder={placeholder}
          type={
            keyboardType == "password" && showPassword ? "text" : keyboardType
          }
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChange={handleChange}
          aria-multiline={multiline}
        />
        {isPassword && (
          <button
            type="button"
            className="flex justify-center items-center cursor-pointer"
            onClick={setShowPassword}
          >
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        )}
      </div>
      {error && errorMessage && (
        <p className="text-red-500 text-sm ">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
