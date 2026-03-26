export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-accent",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    outline: "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}