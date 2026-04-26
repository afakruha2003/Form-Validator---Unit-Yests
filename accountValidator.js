/**
 * accountValidator.js
 * Validation logic for the "Create New Account" form.
 * Fields: firstName, lastName, email, dateOfBirth, password, confirmPassword
 */

const RULES = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 64,
  MIN_AGE: 13,
  MAX_AGE: 120,
};

// ─── Individual field validators ────────────────────────────────────────────

function validateFirstName(value) {
  if (!value || value.trim() === "") return "First name is required.";
  const trimmed = value.trim();
  if (trimmed.length < RULES.NAME_MIN)
    return `First name must be at least ${RULES.NAME_MIN} characters.`;
  if (trimmed.length > RULES.NAME_MAX)
    return `First name must be at most ${RULES.NAME_MAX} characters.`;
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿĞğİıŞşÇçÜüÖö' -]+$/.test(trimmed))
    return "First name contains invalid characters.";
  return null;
}

function validateLastName(value) {
  if (!value || value.trim() === "") return "Last name is required.";
  const trimmed = value.trim();
  if (trimmed.length < RULES.NAME_MIN)
    return `Last name must be at least ${RULES.NAME_MIN} characters.`;
  if (trimmed.length > RULES.NAME_MAX)
    return `Last name must be at most ${RULES.NAME_MAX} characters.`;
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿĞğİıŞşÇçÜüÖö' -]+$/.test(trimmed))
    return "Last name contains invalid characters.";
  return null;
}

function validateEmail(value) {
  if (!value || value.trim() === "") return "Email is required.";
  // RFC-5321 simplified regex
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
    return "Email format is invalid.";
  return null;
}

/**
 * Accepts dd/mm/yyyy format only.
 */
function validateDateOfBirth(value) {
  if (!value || value.trim() === "") return "Date of birth is required.";

  const parts = value.trim().split("/");
  if (parts.length !== 3) return "Date must be in dd/mm/yyyy format.";

  const [dd, mm, yyyy] = parts;

  if (!/^\d{2}$/.test(dd) || !/^\d{2}$/.test(mm) || !/^\d{4}$/.test(yyyy))
    return "Date must be in dd/mm/yyyy format.";

  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  const year = parseInt(yyyy, 10);

  if (month < 1 || month > 12) return "Month must be between 01 and 12.";
  if (day < 1 || day > 31) return "Day must be between 01 and 31.";

  const date = new Date(`${yyyy}-${mm}-${dd}`);
  if (isNaN(date.getTime())) return "Invalid date.";
  // Catch months with fewer days (e.g. 31/04/2000)
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  )
    return "Invalid date.";

  const today = new Date();
  if (date > today) return "Date of birth cannot be in the future.";

  const age = today.getFullYear() - year -
    (today < new Date(`${today.getFullYear()}-${mm}-${dd}`) ? 1 : 0);

  if (age < RULES.MIN_AGE)
    return `You must be at least ${RULES.MIN_AGE} years old.`;
  if (age > RULES.MAX_AGE) return "Please enter a valid date of birth.";

  return null;
}

function validatePassword(value) {
  if (!value || value === "") return "Password is required.";
  if (value.length < RULES.PASSWORD_MIN)
    return `Password must be at least ${RULES.PASSWORD_MIN} characters.`;
  if (value.length > RULES.PASSWORD_MAX)
    return `Password must be at most ${RULES.PASSWORD_MAX} characters.`;
  if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(value)) return "Password must contain at least one digit.";
  if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character.";
  return null;
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || confirmPassword === "")
    return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}

// ─── Full-form validator ─────────────────────────────────────────────────────

function validateForm({ firstName, lastName, email, dateOfBirth, password, confirmPassword }) {
  const errors = {};

  const fnErr = validateFirstName(firstName);
  if (fnErr) errors.firstName = fnErr;

  const lnErr = validateLastName(lastName);
  if (lnErr) errors.lastName = lnErr;

  const emErr = validateEmail(email);
  if (emErr) errors.email = emErr;

  const dobErr = validateDateOfBirth(dateOfBirth);
  if (dobErr) errors.dateOfBirth = dobErr;

  const pwErr = validatePassword(password);
  if (pwErr) errors.password = pwErr;

  const cpErr = validateConfirmPassword(password, confirmPassword);
  if (cpErr) errors.confirmPassword = cpErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  validateFirstName,
  validateLastName,
  validateEmail,
  validateDateOfBirth,
  validatePassword,
  validateConfirmPassword,
  validateForm,
  RULES,
};
