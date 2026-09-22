export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  // Accepts standard Indian / international phone formats
  const cleanPhone = phone.replace(/[\s\-+()]/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 13;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
