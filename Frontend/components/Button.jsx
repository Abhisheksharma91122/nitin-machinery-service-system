export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 shadow-sm";

  const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-accent hover:shadow-md hover:-translate-y-0.5",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 hover:shadow-md hover:-translate-y-0.5",
    outline: "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-50 hover:border-zinc-400 hover:shadow-sm",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-md hover:-translate-y-0.5"
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