import React from 'react';

const Select = React.forwardRef(({
  label,
  error,
  options = [], // Array of strings or { value, label } objects
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || 'select-' + Math.random().toString(36).substr(2, 5);
  return (
    <div className="form-group">
      {label && <label htmlFor={selectId} className="label">{label}</label>}
      <select
        ref={ref}
        id={selectId}
        className={`input-field ${error ? 'error' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => {
          const val = typeof option === 'object' ? option.value : option;
          const labelText = typeof option === 'object' ? option.label : option;
          return (
            <option key={val} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
