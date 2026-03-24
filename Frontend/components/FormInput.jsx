import { forwardRef } from 'react';

const FormInput = forwardRef(({ label, className = '', type = 'text', error, ...props }, ref) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-brand-text">
          {label}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          className={`flex min-h-[80px] w-full rounded-md border ${error ? 'border-red-500' : 'border-zinc-200'} bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...props}
        />
      ) : (
        <input
          type={type}
          className={`flex h-10 w-full rounded-md border ${error ? 'border-red-500' : 'border-zinc-200'} bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...props}
        />
      )}
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
