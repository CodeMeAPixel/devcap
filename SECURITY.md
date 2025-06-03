# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Developer Capitalist seriously. If you discover a security vulnerability, please follow these steps:

1. **Do Not** disclose the vulnerability publicly on GitHub Issues or any other public forum.
2. Email us at [legal@bytebrush.dev](mailto:legal@bytebrush.dev) with details about the vulnerability.
3. Include the following information in your report:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact of the vulnerability
   - Suggestions for mitigating the vulnerability (if you have any)

## What to Expect

- We will acknowledge receipt of your vulnerability report as soon as possible.
- We will work to validate and reproduce the issue.
- We will develop and test a fix for the vulnerability.
- We will notify you when the vulnerability has been fixed.

## Security Measures

Developer Capitalist implements several security measures:

- **Authentication**: Using NextAuth.js with secure token handling
- **Password Security**: All passwords are hashed using bcrypt
- **HTTPS**: All communication is encrypted via HTTPS
- **Database Security**: Restricted database access with parameterized queries
- **Input Validation**: All user inputs are validated and sanitized
- **Regular Updates**: Dependencies are regularly updated to patch security vulnerabilities

## Security Best Practices for Users

- Use a strong, unique password for your Developer Capitalist account
- Enable two-factor authentication if available
- Be cautious of phishing attempts - we will never ask for your password
- Keep your browser and operating system updated

Thank you for helping keep Developer Capitalist and its users safe!
