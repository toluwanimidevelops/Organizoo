import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const { api } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [count, setCount] = useState(1);
  const inputRefs = useRef([]);
  const [sec, setSec] = useState(60);
  
  useEffect(() => {
    if (count !== 2 || sec === 0) return;

    const interval = setInterval(() => {
      setSec((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count, sec]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/sendResetOtp", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        setCount(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSendResetOtp = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/sendResetOtp", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        setSec(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      inputRefs.current[index].value = char;
    });
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  return (
    <>
      {/* Email */}
      <div className="min-h-screen flex justify-center items-center">
        {count === 1 && (
          <div className="min-w-md shadow-2xl flex flex-col p-10 justify-center items-center rounded-xl">
            <h1 className="text-2xl font-bold text-[#16CC95] text-center">
              RESET OTP
            </h1>
            <p className="text-sm mt-3 text-gray-600 text-center">
              Enter your registered email
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="border outline-0 p-3 w-full mt-5 rounded-lg"
            />
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="bg-[#16CC95] flex justify-center items-center text-white rounded-xl cursor-pointer mt-5 p-3 w-full"
            >
              {loading && (
                <div className="size-8 rounded-full  border-t-2  animate-spin"></div>
              )}
              {!loading && "Submit"}
            </button>
          </div>
        )}

        {/*  OTP */}
        {count === 2 && (
          <div className="min-w-md shadow-2xl flex flex-col p-10 justify-center items-center rounded-xl">
            <h1 className="text-2xl font-bold text-[#16CC95] text-center">
              Verify OTP
            </h1>
            <p className="text-sm  mt-3 text-gray-600 text-center">
              Enter the six digit code sent to {email}
            </p>

            <div
              onPaste={handlePaste}
              className="flex gap-3 justify-center items-center"
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    maxLength={1}
                    type="text"
                    key={index}
                    ref={(e) => (inputRefs.current[index] = e)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onInput={(e) => handleInput(e, index)}
                    className="size-12 flex justify-center rounded-sm items-center text-center my-2 border outline-0"
                  />
                ))}
            </div>
            <p className="w-full pl-2">
              Didn't get an otp?{" "}
              <span
                onClick={() =>
                  sec === 0 && !loading
                    ? handleSendResetOtp()
                    : toast.error("Wait a minute")
                }
                className={`cursor-pointer underline`}
              >
                Resend Otp {sec ? sec : ""}
              </span>
            </p>
            <button className="bg-[#16CC95] flex justify-center items-center text-white rounded-xl cursor-pointer mt-5 p-3 w-full">
              {loading ? (
                <div className="size-8 rounded-full  border-t-2  animate-spin"></div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        )}

        {/* New Password */}
        {count === 3 && (
          <div className="min-w-md shadow-2xl flex flex-col p-10 justify-center items-center rounded-xl">
            <h1 className="text-2xl font-bold text-[#16CC95] text-center">
              New Password
            </h1>
            <p className="text-sm  mt-3 text-gray-600 text-center">
              Enter Your new password
            </p>
            <div
              onPaste={handlePaste}
              className="flex gap-3 justify-center items-center"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your New Password"
                className="border outline-0 p-3 w-full mt-5 rounded-lg"
              />
            </div>
            <button
              disabled={loading}
              className="bg-[#16CC95] flex justify-center items-center text-white rounded-xl cursor-pointer mt-5 p-3 w-full"
            >
              {loading ? (
                <div className="size-8 rounded-full  border-t-2  animate-spin"></div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
