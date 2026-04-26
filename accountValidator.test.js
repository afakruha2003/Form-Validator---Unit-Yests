/**
 * accountValidator.test.js
 * Unit tests for the Create New Account form validator.
 *
 * Techniques used:
 *   • Equivalence Partitioning  (valid / invalid classes)
 *   • Boundary Value Analysis   (min-1, min, min+1, max-1, max, max+1)
 *   • Setup & Teardown          (beforeEach / afterEach)
 *   • Assertions                (expect / matchers)
 */

const {
  validateFirstName,
  validateLastName,
  validateEmail,
  validateDateOfBirth,
  validatePassword,
  validateConfirmPassword,
  validateForm,
  RULES,
} = require("../src/accountValidator");

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns a string of exactly `n` characters (letter 'a') */
const str = (n) => "a".repeat(n);

/** Builds a valid base form so individual field tests only override one field */
let baseForm;

// ─────────────────────────────────────────────────────────────────────────────
// Setup & Teardown
// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Fresh valid form data before every test
  baseForm = {
    firstName: "Ali",
    lastName: "Yılmaz",
    email: "ali.yilmaz@example.com",
    dateOfBirth: "10/03/1990",
    password: "SecurePass1!",
    confirmPassword: "SecurePass1!",
  };
});

afterEach(() => {
  // Reset to null after each test (good habit / shows teardown usage)
  baseForm = null;
});

// =============================================================================
// TC-01 ─ FIRST NAME: Valid value (Equivalence Partitioning – valid class)
// =============================================================================
test("TC-01 | firstName – valid name returns no error", () => {
  expect(validateFirstName("Ali")).toBeNull();
});

// =============================================================================
// TC-02 ─ FIRST NAME: Empty string (EP – invalid class: empty)
// =============================================================================
test("TC-02 | firstName – empty string returns required error", () => {
  expect(validateFirstName("")).not.toBeNull();
  expect(validateFirstName("")).toBe("First name is required.");
});

// =============================================================================
// TC-03 ─ FIRST NAME: 1 character – below minimum (BVA: min - 1)
// =============================================================================
test("TC-03 | firstName – 1 char (min-1) returns length error", () => {
  const result = validateFirstName(str(RULES.NAME_MIN - 1)); // 1 char
  expect(result).not.toBeNull();
  expect(result).toMatch(/at least/);
});

// =============================================================================
// TC-04 ─ FIRST NAME: Exactly at minimum (BVA: min = 2)
// =============================================================================
test("TC-04 | firstName – exactly 2 chars (min) returns no error", () => {
  expect(validateFirstName(str(RULES.NAME_MIN))).toBeNull(); // 2 chars
});

// =============================================================================
// TC-05 ─ FIRST NAME: Exactly at maximum (BVA: max = 50)
// =============================================================================
test("TC-05 | firstName – exactly 50 chars (max) returns no error", () => {
  expect(validateFirstName(str(RULES.NAME_MAX))).toBeNull();
});

// =============================================================================
// TC-06 ─ FIRST NAME: 51 characters – above maximum (BVA: max + 1)
// =============================================================================
test("TC-06 | firstName – 51 chars (max+1) returns length error", () => {
  const result = validateFirstName(str(RULES.NAME_MAX + 1));
  expect(result).not.toBeNull();
  expect(result).toMatch(/at most/);
});

// =============================================================================
// TC-07 ─ FIRST NAME: Contains digits (EP – invalid class: bad chars)
// =============================================================================
test("TC-07 | firstName – contains digits returns invalid character error", () => {
  expect(validateFirstName("Ali123")).not.toBeNull();
});

// =============================================================================
// TC-08 ─ EMAIL: Valid email (EP – valid class)
// =============================================================================
test("TC-08 | email – valid email returns no error", () => {
  expect(validateEmail("test@domain.com")).toBeNull();
});

// =============================================================================
// TC-09 ─ EMAIL: Missing @ sign (EP – invalid class: bad format)
// =============================================================================
test("TC-09 | email – missing @ returns format error", () => {
  expect(validateEmail("invalidemail.com")).not.toBeNull();
  expect(validateEmail("invalidemail.com")).toBe("Email format is invalid.");
});

// =============================================================================
// TC-10 ─ EMAIL: Missing domain (EP – invalid class)
// =============================================================================
test("TC-10 | email – missing domain returns format error", () => {
  expect(validateEmail("user@")).not.toBeNull();
});

// =============================================================================
// TC-11 ─ DATE OF BIRTH: Valid date (EP – valid class)
// =============================================================================
test("TC-11 | dateOfBirth – valid date returns no error", () => {
  expect(validateDateOfBirth("15/06/1995")).toBeNull();
});

// =============================================================================
// TC-12 ─ DATE OF BIRTH: Wrong format – missing slashes (EP – invalid format)
// =============================================================================
test("TC-12 | dateOfBirth – wrong format (yyyymmdd) returns format error", () => {
  expect(validateDateOfBirth("19950615")).not.toBeNull();
});

// =============================================================================
// TC-13 ─ DATE OF BIRTH: Future date (EP – invalid: future)
// =============================================================================
test("TC-13 | dateOfBirth – future date returns future error", () => {
  expect(validateDateOfBirth("01/01/2099")).not.toBeNull();
  expect(validateDateOfBirth("01/01/2099")).toBe(
    "Date of birth cannot be in the future."
  );
});

// =============================================================================
// TC-14 ─ DATE OF BIRTH: Impossible day 31 in April (BVA: invalid calendar)
// =============================================================================
test("TC-14 | dateOfBirth – 31/04/yyyy (April has 30 days) returns invalid date", () => {
  expect(validateDateOfBirth("31/04/2000")).toBe("Invalid date.");
});

// =============================================================================
// TC-15 ─ DATE OF BIRTH: User is exactly 12 years old (BVA: min_age - 1)
// =============================================================================
test("TC-15 | dateOfBirth – user is 12 years old (below min age 13) returns age error", () => {
  const today = new Date();
  // Simulate a birthday just after today for 12-year-old
  const dob = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate() + 1);
  const dd = String(dob.getDate()).padStart(2, "0");
  const mm = String(dob.getMonth() + 1).padStart(2, "0");
  const yyyy = dob.getFullYear();
  const result = validateDateOfBirth(`${dd}/${mm}/${yyyy}`);
  expect(result).not.toBeNull();
  expect(result).toMatch(/13/);
});

// =============================================================================
// TC-16 ─ PASSWORD: Valid strong password (EP – valid class)
// =============================================================================
test("TC-16 | password – strong password returns no error", () => {
  expect(validatePassword("SecurePass1!")).toBeNull();
});

// =============================================================================
// TC-17 ─ PASSWORD: Too short – 7 chars (BVA: min - 1)
// =============================================================================
test("TC-17 | password – 7 chars (min-1) returns length error", () => {
  expect(validatePassword("Abc1!xy")).not.toBeNull();
  expect(validatePassword("Abc1!xy")).toMatch(/at least/);
});

// =============================================================================
// TC-18 ─ PASSWORD: Exactly 8 chars valid (BVA: min = 8)
// =============================================================================
test("TC-18 | password – exactly 8 chars (min) and valid returns no error", () => {
  expect(validatePassword("Abcde1!z")).toBeNull();
});

// =============================================================================
// TC-19 ─ PASSWORD: No uppercase letter (EP – invalid class: missing uppercase)
// =============================================================================
test("TC-19 | password – no uppercase letter returns uppercase error", () => {
  const result = validatePassword("securepass1!");
  expect(result).not.toBeNull();
  expect(result).toMatch(/uppercase/);
});

// =============================================================================
// TC-20 ─ PASSWORD: No special character (EP – invalid class: missing special)
// =============================================================================
test("TC-20 | password – no special character returns special char error", () => {
  const result = validatePassword("SecurePass1");
  expect(result).not.toBeNull();
  expect(result).toMatch(/special/);
});

// =============================================================================
// TC-21 ─ CONFIRM PASSWORD: Matches password (EP – valid class)
// =============================================================================
test("TC-21 | confirmPassword – matching passwords returns no error", () => {
  expect(validateConfirmPassword("SecurePass1!", "SecurePass1!")).toBeNull();
});

// =============================================================================
// TC-22 ─ CONFIRM PASSWORD: Does not match (EP – invalid class: mismatch)
// =============================================================================
test("TC-22 | confirmPassword – mismatch returns match error", () => {
  const result = validateConfirmPassword("SecurePass1!", "WrongPass2@");
  expect(result).not.toBeNull();
  expect(result).toBe("Passwords do not match.");
});

// =============================================================================
// TC-23 ─ FULL FORM: All valid inputs (Integration – happy path)
// =============================================================================
test("TC-23 | validateForm – all valid fields returns isValid=true", () => {
  const { isValid, errors } = validateForm(baseForm);
  expect(isValid).toBe(true);
  expect(Object.keys(errors).length).toBe(0);
});

// =============================================================================
// TC-24 ─ FULL FORM: All fields empty (Integration – full invalid)
// =============================================================================
test("TC-24 | validateForm – all empty fields returns 6 errors", () => {
  const { isValid, errors } = validateForm({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  expect(isValid).toBe(false);
  expect(Object.keys(errors).length).toBe(6);
});

// =============================================================================
// TC-25 ─ FULL FORM: Only email invalid (Integration – single field failure)
// =============================================================================
test("TC-25 | validateForm – only email invalid returns exactly 1 error on email", () => {
  const form = { ...baseForm, email: "not-an-email" };
  const { isValid, errors } = validateForm(form);
  expect(isValid).toBe(false);
  expect(errors.email).toBeDefined();
  expect(Object.keys(errors).length).toBe(1);
});

// =============================================================================
// TC-26 ─ LAST NAME: null value (EP – invalid class: null input)
// =============================================================================
test("TC-26 | lastName – null input returns required error", () => {
  expect(validateLastName(null)).toBe("Last name is required.");
});

// =============================================================================
// TC-27 ─ DATE OF BIRTH: Month 00 (BVA: month below minimum)
// =============================================================================
test("TC-27 | dateOfBirth – month 00 returns month error", () => {
  expect(validateDateOfBirth("01/00/2000")).toBe("Month must be between 01 and 12.");
});
