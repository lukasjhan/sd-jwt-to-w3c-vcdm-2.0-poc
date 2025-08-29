import { SDJwtInstance } from "@sd-jwt/core";
import type { DisclosureFrame } from "@sd-jwt/types";
import { ES256, digest, generateSalt } from "@sd-jwt/crypto-nodejs";

const createSignerVerifier = async () => {
  const { privateKey, publicKey } = await ES256.generateKeyPair();
  return {
    privateKey,
    publicKey,
    signer: await ES256.getSigner(privateKey),
    verifier: await ES256.getVerifier(publicKey),
  };
};

const transformSDJWTKBtoVCDM2 = (
  sdjwtkb: string,
  holderId: string,
  transactionId: string
) => {
  // you can check the enveloping proof here
  // https://www.w3.org/TR/vc-data-model-2.0/#securing-mechanisms
  const vp = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://example.iata.org/schema/transactions/v1", // example schmea context for `transactionId`
    ],
    type: ["VerifiablePresentation"],
    holder: holderId,
    transactionId,
    verifiableCredential: [
      {
        "@context": "https://www.w3.org/ns/credentials/v2",
        type: "EnvelopedVerifiableCredential",
        id: `data:application/vc+sd-jwt,${sdjwtkb}`,
      },
    ],
  };

  return vp;
};

(async () => {
  const { signer, verifier } = await createSignerVerifier();
  const {
    signer: holderSigner,
    verifier: holderVerifier,
    publicKey: holderPublicKey,
  } = await createSignerVerifier();

  const holderPubJwk = {
    kty: holderPublicKey.kty,
    crv: holderPublicKey.crv,
    alg: ES256.alg,
    x: holderPublicKey.x,
    y: holderPublicKey.y,
  };

  // Create SDJwt instance for use
  const sdjwt = new SDJwtInstance({
    signer,
    verifier,
    signAlg: ES256.alg,
    hasher: digest,
    hashAlg: "sha-256",
    saltGenerator: generateSalt,
    kbSigner: holderSigner,
    kbSignAlg: ES256.alg,
    kbVerifier: holderVerifier,
  });

  // Issuer Define the claims object with the user's information
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

  // Issuer Define the disclosure frame to specify which claims can be disclosed
  const disclosureFrame: DisclosureFrame<typeof claims> = {
    credentialSubject: {
      degree: {
        _sd: ["name", "type", "date"],
      },
    },
  };

  // Issue a signed JWT credential with the specified claims and disclosures
  // Return a Encoded SD JWT. Issuer send the credential to the holder
  const credential = await sdjwt.issue(claims, disclosureFrame, {
    header: {
      kid: "keyId-1",
      typ: "vc+sd-jwt",
      cty: "vc",
    },
  });
  console.log("encodedJwt:", credential);

  // Holder Define the presentation frame to specify which claims should be presented
  // The list of presented claims must be a subset of the disclosed claims
  // the presentation frame is determined by the verifier or the protocol that was agreed upon between the holder and the verifier
  const presentationFrame = {
    credentialSubject: {
      degree: {
        name: true,
        type: true,
      },
    },
  };

  const kbPayload = {
    iat: Math.floor(Date.now() / 1000),
    aud: "did:example:123",
    nonce: "nonce-1",
  };

  // Create a presentation using the issued credential and the presentation frame
  // return a Encoded SD JWT. Holder send the presentation to the verifier
  const presentation = await sdjwt.present<typeof claims>(
    credential,
    presentationFrame,
    {
      kb: {
        payload: kbPayload,
      },
    }
  );
  console.log("presentedSDJwt:", presentation);

  // now transform the SD JWT to VCDM2
  const vcdm2 = transformSDJWTKBtoVCDM2(
    presentation,
    "did:example:123",
    "txId"
  );
  console.log("vcdm2:", vcdm2);
})();
