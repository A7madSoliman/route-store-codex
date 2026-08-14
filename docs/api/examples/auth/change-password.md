# Update Logged user password

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Update Logged user password` |
| HTTP method | `PUT` |
| Request URL | `https://<approved-base>/users/changeMyPassword` |
| Normalized endpoint | `/users/changeMyPassword` |
| Authentication category | Controlled mutation using the dedicated synthetic test account |
| Observed status code | `200` for valid changes; `400` for validation/current-password failures; `401` for the invalidated pre-change token |
| Capture date | `2026-08-14T13:29:14Z` |
| Response time | Not retained |
| Safe response headers | None recorded |
| Sanitization note | Passwords, tokens, cookies, email, phone, names, and raw response bodies were kept out of the repository. |

## Safe request parameters

The inventoried endpoint and body fields were used exactly:

```json
{
  "currentPassword": "<password>",
  "password": "<password>",
  "rePassword": "<password>"
}
```

All three fields are required for a successful request. No alternate endpoint, field, or authentication scheme was used.

## Safe response example

A valid password change returned HTTP `200` with this observed top-level shape:

```json
{
  "message": "<string>",
  "user": {
    "name": "<name>",
    "email": "<email>",
    "role": "<string>"
  },
  "token": "<token>"
}
```

Validation and wrong-current-password requests returned HTTP `400` without a persisted response body. The pre-change token was rejected with HTTP `401` after a successful password change.

## Validation and error observations

| Case | Status |
|---|---:|
| Missing `currentPassword` | `400` |
| Missing `rePassword` | `400` |
| Mismatched `password` and `rePassword` | `400` |
| Incorrect `currentPassword` | `400` |
| Valid current/new/confirmation passwords | `200` |
| Pre-change token after successful change | `401` |

The exact validation messages and broader password policy remain unrecorded because raw error bodies were not persisted.

## Token and session behavior

- A valid password change returned a nonempty token field.
- The returned token differed from the pre-change token.
- The pre-change token was rejected when used to restore the original password.
- A fresh sign-in with the new password returned `200` and supplied a usable token.
- The original password was restored using that fresh token.
- Final sign-in with the restored original credentials returned `200`.

This is evidence of token invalidation/rotation for the existing pre-change token in this controlled observation. It does not establish cross-device logout or universal session revocation semantics.

## Before state, cleanup, and after state

The dedicated account's original password was retained outside the repository. The account was changed once to a synthetic password, then restored using a fresh token obtained by signing in with that synthetic password. Final sign-in with the original credentials returned `200`.

## Unknown behavior

- Password length, character, normalization, reuse, and rate-limit rules remain unverified.
- Exact error envelopes and messages remain unverified.
- Cross-device/session behavior remains unverified.
- Whether every protected endpoint observes the same token invalidation behavior remains unverified.

## Related decisions

- `AUTH-002` — The inventoried custom `token` header was accepted for the protected mutation; no Bearer comparison was performed.
- `AUTH-008` — This observation establishes token replacement and rejection of the pre-change token for password change.
