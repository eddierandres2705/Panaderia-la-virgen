import React from 'react';

const Logo = ({ className = "w-16 h-16" }) => {
  return (
    <img 
      src="https://customer-assets.emergentagent.com/job_panaderia-virgen/artifacts/cyjdtynt_Copilot_20260603_151931.png"
      alt="Panadería de la Virgen Logo"
      className={className}
    />
  );
};

export default Logo;
