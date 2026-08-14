# Update Logged user data

## Observation

| Field | Recorded value |
|---|---|
| Request name | `Update Logged user data` |
| HTTP method | `PUT` |
| Request URL | `https://<approved-base>/users/updateMe` |
| Normalized endpoint | `/users/updateMe` |
| Authentication category | Controlled mutation using the dedicated synthetic test account |
| Observed status code | `200` for single-field updates; `400` for the full three-field body; `401` with an invalid token |
| Capture date | `2026-08-14T13:20:54Z` |
| Response time | Not retained |
| Safe response headers | None recorded |
| Sanitization note | Credentials, token, email, phone, names, and raw response bodies were kept out of the repository. |

## Safe request parameters

The inventoried request body fields were used exactly: `name`, `email`, and `phone`.

Observed request variants:

- Full body containing all three fields: returned `400`.
- `{ name }`: returned `200`.
- `{ phone }`: returned `200`.
- `{ email }`: returned `200`.

Each successful synthetic change was restored immediately. The final sign-in with the restored credentials returned `200`.

## Safe response example

Successful partial updates returned a JSON object with the top-level shape:

```json
{
  "message": "<string>",
  "user": {
    "name": "<name>",
    "email": "<email>",
    "role": "<string>"
  }
}
```

The full three-field request returned `400` without a persisted response body. An invalid token returned `401`.

## Observed fields and data types

| JSON path | Observed type | Notes |
|---|---|---|
| `message` | `string` | Present on successful partial updates |
| `user` | `object` | Present on successful partial updates |
| `user.name` | `string` | Present in the returned user object |
| `user.email` | `string` | Present in the returned user object |
| `user.role` | `string` | Present in the returned user object |
| `token` | Not observed | No token appeared in the profile-update response shape |
| `user.phone` | Not observed | The response did not expose a phone field in this observation |

## Before state, cleanup, and after state

The dedicated account's original name, email, and phone were captured outside the repository. Synthetic name, phone, and email values were used in separate reversible partial updates. Each value was restored using a single-field update. Final sign-in with the original email and password returned `200`.

## Unknown behavior

- The reason the full three-field body returned `400` is not known from the sanitized response.
- Broader combinations of multiple fields were not tested.
- Validation rules and conflict behavior remain unverified.
- Token rotation, invalidation, and existing-session behavior remain unresolved; the update response returned no token.
- No current-user endpoint was verified. Sign-in remains the only verified identity source in this observation set.
- The returned `user` object does not include an observed phone field, so phone reconciliation requires a separate product decision or subsequent verified source.

## Related decisions

- `AUTH-002` — The custom `token` header was accepted for this protected mutation; universal transport behavior remains provisional.
- `AUTH-007` — Sign-in returned `user.name`, `user.email`, and `user.role`; no current-user endpoint was established.
- `AUTH-008` — Profile-update token rotation/invalidation remains unresolved.
- `ACCOUNT-001` — Single-field partial updates were observed; full-body behavior returned `400` and remains unexplained.
