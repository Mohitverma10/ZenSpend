import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || 'input-' + Math.random().toString(36).substr(2, 5);
  return (
    <div className="form-group">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={`input-field ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
