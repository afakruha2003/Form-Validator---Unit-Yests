# Create New Account – Form Validator & Unit Tests

##  Project Structure

```
account-form-tests/
├── src/
│   ├── accountValidator.js       ← Validation logic (the "form brain")
│   └── accountValidator.test.js  ← 27 Jest unit tests
├── .github/
│   └── workflows/
│       └── test.yml              ← GitHub Actions CI pipeline
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

##  Fields Tested

| Field            | Technique Used                    |
|------------------|-----------------------------------|
| First Name       | EP (valid/empty/bad chars) + BVA  |
| Last Name        | EP (null input)                   |
| Email            | EP (valid/missing @/missing domain)|
| Date of Birth    | EP + BVA (future, age, bad month) |
| Password         | EP (missing rules) + BVA (length) |
| Confirm Password | EP (match / mismatch)             |
| Full Form        | Integration (all valid, all empty)|

---

##  How to Run Locally

### 1. Install Node.js
Download from https://nodejs.org (choose LTS version 20+)

### 2. Clone / download project, then:
```bash
cd account-form-tests
npm install
npm test
```

### 3. With coverage report:
```bash
npm run test:coverage
```
A `coverage/` folder is created. Open `coverage/lcov-report/index.html` in your browser.

---

##  GitHub Actions (CI/CD)

Every `git push` triggers the pipeline automatically:

1. GitHub checks out the code
2. Installs Node.js + Jest
3. Runs all 27 tests
4. Uploads coverage report as a downloadable artifact

### How to see results on GitHub:
→ Go to your repo → **Actions** tab → click the latest workflow run

---

## 📋 Test Case Summary (27 total)

| TC   | Field            | Technique | Input Description                   | Expected Result  |
|------|------------------|-----------|-------------------------------------|------------------|
| TC-01| First Name       | EP Valid  | "Ali"                               | No error         |
| TC-02| First Name       | EP Invalid| ""  (empty)                         | Required error   |
| TC-03| First Name       | BVA min-1 | 1 character                         | Length error     |
| TC-04| First Name       | BVA min   | 2 characters                        | No error         |
| TC-05| First Name       | BVA max   | 50 characters                       | No error         |
| TC-06| First Name       | BVA max+1 | 51 characters                       | Length error     |
| TC-07| First Name       | EP Invalid| "Ali123" (has digits)               | Char error       |
| TC-08| Email            | EP Valid  | "test@domain.com"                   | No error         |
| TC-09| Email            | EP Invalid| "invalidemail.com" (no @)           | Format error     |
| TC-10| Email            | EP Invalid| "user@" (no domain)                 | Format error     |
| TC-11| Date of Birth    | EP Valid  | "15/06/1995"                        | No error         |
| TC-12| Date of Birth    | EP Invalid| "19950615" (wrong format)           | Format error     |
| TC-13| Date of Birth    | EP Invalid| "01/01/2099" (future)               | Future error     |
| TC-14| Date of Birth    | BVA       | "31/04/2000" (April has 30 days)    | Invalid date     |
| TC-15| Date of Birth    | BVA min-1 | 12 years old (below min age 13)     | Age error        |
| TC-16| Password         | EP Valid  | "SecurePass1!"                      | No error         |
| TC-17| Password         | BVA min-1 | 7 characters                        | Length error     |
| TC-18| Password         | BVA min   | 8 characters (valid)                | No error         |
| TC-19| Password         | EP Invalid| No uppercase letter                 | Uppercase error  |
| TC-20| Password         | EP Invalid| No special character                | Special error    |
| TC-21| Confirm Password | EP Valid  | Matches password                    | No error         |
| TC-22| Confirm Password | EP Invalid| Does not match                      | Mismatch error   |
| TC-23| Full Form        | Integration| All fields valid                   | isValid = true   |
| TC-24| Full Form        | Integration| All fields empty                   | 6 errors         |
| TC-25| Full Form        | Integration| Only email invalid                 | 1 error (email)  |
| TC-26| Last Name        | EP Invalid| null input                          | Required error   |
| TC-27| Date of Birth    | BVA       | Month = 00 (below minimum)          | Month error      |
"## Updated" 
