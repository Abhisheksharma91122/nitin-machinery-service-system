export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
  
  const variants = {
    primary: "bg-brand-blue text-brand-white hover:bg-brand-accent shadow-sm",
    secondary: "bg-zinc-100 text-brand-text hover:bg-zinc-200",
    outline: "border border-zinc-200 bg-transparent hover:bg-zinc-100 text-brand-text",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm"
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
