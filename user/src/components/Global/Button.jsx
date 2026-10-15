function Button({
  text,
  type = "button",
  onClick,
  buttonBackground,
  hoverBackground,
  disabledBackground,
  widthFull,
  isDisabled = false,
  loading = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || loading}
      className={`${widthFull ? "w-full" : "w-40"} ${buttonBackground} ${hoverBackground} ${disabledBackground} disabled:cursor-not-allowed duration-500 py-3 active:scale-95 transition text-sm text-white rounded-full cursor-pointer`}
    >
      <p className="mb-0.5">{loading ? "Loading..." : text}</p>
    </button>
  );
}
export default Button;