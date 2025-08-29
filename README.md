# SD-JWT to W3C VCDM 2.0

This is a simple poc of how to transform a SD-JWT to a W3C VCDM 2.0 VerifiablePresentation.

If you want to check the details of how it works, you can check the `src/index.ts` file.

For more details about the SD-JWT and VCDM 2.0, you can check the following links:

- [W3C VCMD 2.0](https://www.w3.org/TR/vc-data-model-2.0)
- [Enveloping proof](https://www.w3.org/TR/vc-data-model-2.0/#securing-mechanisms)
- [VC-JOSE-COSE](https://www.w3.org/TR/vc-jose-cose/)
- [SD-JWT](https://datatracker.ietf.org/doc/draft-ietf-oauth-selective-disclosure-jwt/)
- [SD-JWT VC](https://datatracker.ietf.org/doc/draft-ietf-oauth-sd-jwt-vc/)

## Installation

```bash
pnpm install
```

## Usage

```bash
// you can simply run the test and see the output
pnpm run test
```

## Details

### Payload

```ts
const claims = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://www.w3.org/ns/credentials/examples/v2",
  ],
  issuer: "https://university.example/issuers/565049",
  validFrom: "2010-01-01T19:23:24Z",
  validUntil: "2024-12-26T21:25:01Z",
  credentialSchema: {
    type: "JsonSchema",
    id: "https://university.example/types/degree.json",
  },
  credentialSubject: {
    degree: {
      name: "Bachelor of Science and Arts",
      type: "BachelorDegree",
      date: "2024-12-26T21:25:01Z",
    },
    id: "did:example:123",
  },
  iss: "https://university.example/issuers/565049",
  sub: "did:example:123",
  iat: 1261373804,
  nbf: 1262373804,
  exp: 1735248301,
  cnf: {
    jwk: holderPubJwk,
  },
  id: "http://university.example/credentials/1872",
  type: ["VerifiableCredential", "ExampleAlumniCredential"],
  vct: "https://university.example/types/degree.json",
};
```

### Example SD-JWT credential

```
eyJ0eXAiOiJ2YytzZC1qd3QiLCJraWQiOiJrZXlJZC0xIiwiY3R5IjoidmMiLCJhbGciOiJFUzI1NiJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvZXhhbXBsZXMvdjIiXSwiaXNzdWVyIjoiaHR0cHM6Ly91bml2ZXJzaXR5LmV4YW1wbGUvaXNzdWVycy81NjUwNDkiLCJ2YWxpZEZyb20iOiIyMDEwLTAxLTAxVDE5OjIzOjI0WiIsInZhbGlkVW50aWwiOiIyMDI0LTEyLTI2VDIxOjI1OjAxWiIsImNyZWRlbnRpYWxTY2hlbWEiOnsidHlwZSI6Ikpzb25TY2hlbWEiLCJpZCI6Imh0dHBzOi8vdW5pdmVyc2l0eS5leGFtcGxlL3R5cGVzL2RlZ3JlZS5qc29uIn0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImRlZ3JlZSI6eyJfc2QiOlsiNUZ5ZDd1MjZMcjhRdGw1aHdGSFJ1Vll3cEdyUUNyWFg5NDQ4R2kwNEVXdyIsIkcwNWltc3J0VmZHYXd6WjhJZFJUcDJqbDg4SUtlTEd5N3E2bE1JMTRKYUEiLCJoVTMzY2ZZM0JFTGFUbTVvVmFzdDVIR0lWMzlIZ2tSei1mSktkcmV0ZnpBIl19LCJpZCI6ImRpZDpleGFtcGxlOjEyMyJ9LCJpc3MiOiJodHRwczovL3VuaXZlcnNpdHkuZXhhbXBsZS9pc3N1ZXJzLzU2NTA0OSIsInN1YiI6ImRpZDpleGFtcGxlOjEyMyIsImlhdCI6MTI2MTM3MzgwNCwibmJmIjoxMjYyMzczODA0LCJleHAiOjE3MzUyNDgzMDEsImNuZiI6eyJqd2siOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsImFsZyI6IkVTMjU2IiwieCI6IndXaWo3dF9pMUdScS1UVV9OSkhkTm1SVFoyQl9HUHRWdDAxWTNLTi0tUlkiLCJ5IjoiRUY0c19XZjVnMWQ2dFNrSER3VGlOaTVzTkJSb3g0dVk5cVk2SmFDa3J6ayJ9fSwiaWQiOiJodHRwOi8vdW5pdmVyc2l0eS5leGFtcGxlL2NyZWRlbnRpYWxzLzE4NzIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXhhbXBsZUFsdW1uaUNyZWRlbnRpYWwiXSwidmN0IjoiaHR0cHM6Ly91bml2ZXJzaXR5LmV4YW1wbGUvdHlwZXMvZGVncmVlLmpzb24iLCJfc2RfYWxnIjoic2hhLTI1NiJ9.8AKk1cgolizpxki240ahmUG49foRo27AApmFag3-uHmuGOq0-__OUTW03nmUKm_viQfbjdSLljVTvu9WBqMnwQ~WyI3YmRhNDYxNjgwNTU5M2NlIiwibmFtZSIsIkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiXQ~WyI3ZTM3N2MyOTAyN2U0NDg3IiwidHlwZSIsIkJhY2hlbG9yRGVncmVlIl0~WyIzNjliZjNhNDNiZDg5MDJkIiwiZGF0ZSIsIjIwMjQtMTItMjZUMjE6MjU6MDFaIl0~
```

### Example of SD-JWt+KB presenation

```
eyJ0eXAiOiJ2YytzZC1qd3QiLCJraWQiOiJrZXlJZC0xIiwiY3R5IjoidmMiLCJhbGciOiJFUzI1NiJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvZXhhbXBsZXMvdjIiXSwiaXNzdWVyIjoiaHR0cHM6Ly91bml2ZXJzaXR5LmV4YW1wbGUvaXNzdWVycy81NjUwNDkiLCJ2YWxpZEZyb20iOiIyMDEwLTAxLTAxVDE5OjIzOjI0WiIsInZhbGlkVW50aWwiOiIyMDI0LTEyLTI2VDIxOjI1OjAxWiIsImNyZWRlbnRpYWxTY2hlbWEiOnsidHlwZSI6Ikpzb25TY2hlbWEiLCJpZCI6Imh0dHBzOi8vdW5pdmVyc2l0eS5leGFtcGxlL3R5cGVzL2RlZ3JlZS5qc29uIn0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImRlZ3JlZSI6eyJfc2QiOlsiNUZ5ZDd1MjZMcjhRdGw1aHdGSFJ1Vll3cEdyUUNyWFg5NDQ4R2kwNEVXdyIsIkcwNWltc3J0VmZHYXd6WjhJZFJUcDJqbDg4SUtlTEd5N3E2bE1JMTRKYUEiLCJoVTMzY2ZZM0JFTGFUbTVvVmFzdDVIR0lWMzlIZ2tSei1mSktkcmV0ZnpBIl19LCJpZCI6ImRpZDpleGFtcGxlOjEyMyJ9LCJpc3MiOiJodHRwczovL3VuaXZlcnNpdHkuZXhhbXBsZS9pc3N1ZXJzLzU2NTA0OSIsInN1YiI6ImRpZDpleGFtcGxlOjEyMyIsImlhdCI6MTI2MTM3MzgwNCwibmJmIjoxMjYyMzczODA0LCJleHAiOjE3MzUyNDgzMDEsImNuZiI6eyJqd2siOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsImFsZyI6IkVTMjU2IiwieCI6IndXaWo3dF9pMUdScS1UVV9OSkhkTm1SVFoyQl9HUHRWdDAxWTNLTi0tUlkiLCJ5IjoiRUY0c19XZjVnMWQ2dFNrSER3VGlOaTVzTkJSb3g0dVk5cVk2SmFDa3J6ayJ9fSwiaWQiOiJodHRwOi8vdW5pdmVyc2l0eS5leGFtcGxlL2NyZWRlbnRpYWxzLzE4NzIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXhhbXBsZUFsdW1uaUNyZWRlbnRpYWwiXSwidmN0IjoiaHR0cHM6Ly91bml2ZXJzaXR5LmV4YW1wbGUvdHlwZXMvZGVncmVlLmpzb24iLCJfc2RfYWxnIjoic2hhLTI1NiJ9.8AKk1cgolizpxki240ahmUG49foRo27AApmFag3-uHmuGOq0-__OUTW03nmUKm_viQfbjdSLljVTvu9WBqMnwQ~WyI3YmRhNDYxNjgwNTU5M2NlIiwibmFtZSIsIkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiXQ~WyI3ZTM3N2MyOTAyN2U0NDg3IiwidHlwZSIsIkJhY2hlbG9yRGVncmVlIl0~eyJ0eXAiOiJrYitqd3QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE3NTY0NTEzMTEsImF1ZCI6ImRpZDpleGFtcGxlOjEyMyIsIm5vbmNlIjoibm9uY2UtMSIsInNkX2hhc2giOiJxNFZhbklvcGhzQkl5b05uSnRCMnBqdV8zTzEyUXd6aWpjRjJVZGxsSURNIn0.8eGBvKJOpeqJCMmD8LjN00yjAQ-5XFdH1WpKoD_Cr1rgSxQ8kS9J-HH98HmeP8pxE7ygQH3MQkKNtZ9J466LVQ
```

### Example of VCDM2 transformation

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://example.iata.org/schema/transactions/v1"
  ],
  "type": ["VerifiablePresentation"],
  "holder": "did:example:123",
  "transactionId": "txId",
  "verifiableCredential": [
    {
      "@context": "https://www.w3.org/ns/credentials/v2",
      "type": "EnvelopedVerifiableCredential",
      "id": "data:application/vc+sd-jwt,eyJ0eXAiOiJ2YytzZC1qd3QiLCJraWQiOiJrZXlJZC0xIiwiY3R5IjoidmMiLCJhbGciOiJFUzI1NiJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvZXhhbXBsZXMvdjIiXSwiaXNzdWVyIjoiaHR0cHM6Ly91bml2ZXJzaXR5LmV4YW1wbGUvaXNzdWVycy81NjUwNDkiLCJ2YWxpZEZyb20iOiIyMDEwLTAxLTAxVDE5OjIzOjI0WiIsInZhbGlkVW50aWwiOiIyMDI0LTEyLTI2VDIxOjI1OjAxWiIsImNyZWRlbnRpYWxTY2hlbWEiOnsidHlwZSI6Ikpzb25TY2hlbWEiLCJpZCI6Imh0dHBzOi8vdW5pdmVyc2l0eS5leGFtcGxlL3R5cGVzL2RlZ3JlZS5qc29uIn0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImRlZ3JlZSI6eyJfc2QiOlsiNUZ5ZDd1MjZMcjhRdGw1aHdGSFJ1Vll3cEdyUUNyWFg5NDQ4R2kwNEVXdyIsIkcwNWltc3J0VmZHYXd6WjhJZFJUcDJqbDg4SUtlTEd5N3E2bE1JMTRKYUEiLCJoVTMzY2ZZM0JFTGFUbTVvVmFzdDVIR0lWMzlIZ2tSei1mSktkcmV0ZnpBIl19LCJpZCI6ImRpZDpleGFtcGxlOjEyMyJ9LCJpc3MiOiJodHRwczovL3VuaXZlcnNpdHkuZXhhbXBsZS9pc3N1ZXJzLzU2NTA0OSIsInN1YiI6ImRpZDpleGFtcGxlOjEyMyIsImlhdCI6MTI2MTM3MzgwNCwibmJmIjoxMjYyMzczODA0LCJleHAiOjE3MzUyNDgzMDEsImNuZiI6eyJqd2siOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsImFsZyI6IkVTMjU2IiwieCI6IndXaWo3dF9pMUdScS1UVV9OSkhkTm1SVFoyQl9HUHRWdDAxWTNLTi0tUlkiLCJ5IjoiRUY0c19XZjVnMWQ2dFNrSER3VGlOaTVzTkJSb3g0dVk5cVk2SmFDa3J6ayJ9fSwiaWQiOiJodHRwOi8vdW5pdmVyc2l0eS5leGFtcGxlL2NyZWRlbnRpYWxzLzE4NzIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXhhbXBsZUFsdW1uaUNyZWRlbnRpYWwiXSwidmN0IjoiaHR0cHM6Ly91bml2ZXJzaXR5LmV4YW1wbGUvdHlwZXMvZGVncmVlLmpzb24iLCJfc2RfYWxnIjoic2hhLTI1NiJ9.8AKk1cgolizpxki240ahmUG49foRo27AApmFag3-uHmuGOq0-__OUTW03nmUKm_viQfbjdSLljVTvu9WBqMnwQ~WyI3YmRhNDYxNjgwNTU5M2NlIiwibmFtZSIsIkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMiXQ~WyI3ZTM3N2MyOTAyN2U0NDg3IiwidHlwZSIsIkJhY2hlbG9yRGVncmVlIl0~eyJ0eXAiOiJrYitqd3QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE3NTY0NTEzMTEsImF1ZCI6ImRpZDpleGFtcGxlOjEyMyIsIm5vbmNlIjoibm9uY2UtMSIsInNkX2hhc2giOiJxNFZhbklvcGhzQkl5b05uSnRCMnBqdV8zTzEyUXd6aWpjRjJVZGxsSURNIn0.8eGBvKJOpeqJCMmD8LjN00yjAQ-5XFdH1WpKoD_Cr1rgSxQ8kS9J-HH98HmeP8pxE7ygQH3MQkKNtZ9J466LVQ"
    }
  ]
}
```

## Contributing

Any feedback is welcome!

## License

MIT
