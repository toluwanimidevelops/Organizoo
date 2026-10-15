function Button({
  icon,
  text,
  bgColor = "bg-slate-700",
  textColor = "text-white",
}) {
  return (
    <button
      type="button"
      className={`px-5 py-3 cursor-pointer font-main active:scale-95 transition text-sm ${textColor} rounded-full ${bgColor} flex items-center justify-center gap-1`}
    >
      {icon}
      <p >{text}</p>
    </button>
  );
}
export default Button;
