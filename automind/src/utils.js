// src/utils.js

// ✅ Page routing helper
export const createPageUrl = (page) => {
  switch (page) {
    case "RoleSelection":
      return "/role-selection";
    default:
      return "/";
  }
};

// ✅ className utility (REQUIRED by Input, Label, etc.)
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
