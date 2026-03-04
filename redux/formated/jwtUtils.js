// Simple JWT utility for local token generation and validation
// Not using cryptographic signing (no backend), just base64 encoding + metadata

const generateToken = (payload, expiresInHours = 24) => { 
  // ⁡⁣⁢⁣𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗮 𝘀𝗶𝗺𝗽𝗹𝗲 𝗝𝗪𝗧 𝘁𝗼𝗸𝗲𝗻 𝘄𝗶𝘁𝗵 𝗮 𝗽𝗮𝘆𝗹𝗼𝗮𝗱 𝗮𝗻𝗱 𝗲𝘅𝗽𝗶𝗿𝘆 𝘁𝗶𝗺𝗲, 𝗲𝘅𝗽𝗶𝗿𝗲𝘀𝗜𝗻𝗛𝗼𝘂𝗿𝘀 𝗱𝗲𝗳𝗮𝘂𝗹𝘁𝘀 𝘁𝗼 𝟮𝟰 𝗵𝗼𝘂𝗿𝘀 𝗶𝗳 𝗻𝗼𝘁 𝗽𝗿𝗼𝘃𝗶𝗱𝗲𝗱, 𝘁𝗵𝗶𝘀 𝗳𝘂𝗻𝗰𝘁𝗶𝗼𝗻 𝗰𝗿𝗲𝗮𝘁𝗲𝘀 𝗮 𝘁𝗼𝗸𝗲𝗻 𝘁𝗵𝗮𝘁 𝗶𝗻𝗰𝗹𝘂𝗱𝗲𝘀 𝘁𝗵𝗲 𝗽𝗮𝘆𝗹𝗼𝗮𝗱 𝗮𝗹𝗼𝗻𝗴 𝘄𝗶𝘁𝗵 𝗶𝘀𝘀𝘂𝗲𝗱 𝗮𝘁 (𝗶𝗮𝘁) 𝗮𝗻𝗱 𝗲𝘅𝗽𝗶𝗿𝘆 (𝗲𝘅𝗽) 𝘁𝗶𝗺𝗲𝘀𝘁𝗮𝗺𝗽𝘀, 𝗶𝘁 𝘂𝘀𝗲𝘀 𝗯𝗮𝘀𝗲𝟲𝟰 𝗲𝗻𝗰𝗼𝗱𝗶𝗻𝗴 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗵𝗲𝗮𝗱𝗲𝗿 𝗮𝗻𝗱 𝗽𝗮𝘆𝗹𝗼𝗮𝗱, 𝗯𝘂𝘁 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝗶𝗻𝗰𝗹𝘂𝗱𝗲 𝗮 𝘀𝗶𝗴𝗻𝗮𝘁𝘂𝗿𝗲 𝘀𝗶𝗻𝗰𝗲 𝘁𝗵𝗶𝘀 𝗶𝘀 𝗺𝗲𝗮𝗻𝘁 𝗳𝗼𝗿 𝗹𝗼𝗰𝗮𝗹 𝘂𝘀𝗲 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝗯𝗮𝗰𝗸𝗲𝗻𝗱 𝘃𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻.⁡


  const header = { alg: "none", typ: "JWT" }; 
  // JWT header indicating no signing algorithm (alg: "none") and token type (typ: "JWT"), this is a standard header for JWT tokens, but since we are not signing the token, we set alg to "none".


  const now = Date.now(); 
  // Current timestamp in milliseconds, this will be used to set the issued at (iat) and expiry (exp) times for the token, it represents the time when the token was generated.


  const expiresAt = now + expiresInHours * 60 * 60 * 1000; 
  // Calculate the expiry time by adding the specified number of hours (converted to milliseconds) to the current time, this determines how long the token will be valid before it expires.

  const tokenPayload = { // Combine the provided payload with standard JWT claims
    ...payload, 
    // Spread the user-provided payload into the token payload, this allows us to include any custom data (like userId, email, etc.) in the token, while also adding standard claims like iat and exp.
    iat: now, // Issued at time, set to the current timestamp, this indicates when the token was created and can be used for validation purposes.
    exp: expiresAt, // Expiry time, set to the calculated expiry timestamp, this indicates when the token will expire and should no longer be considered valid.
  };

  // Encode header and payload to base64 (not cryptographically signed)
  const headerEncoded = btoa(JSON.stringify(header)); // Encode the header as a JSON string and then convert it to base64, this is a standard part of the JWT structure, where the header is encoded in base64 format.
  const payloadEncoded = btoa(JSON.stringify(tokenPayload)); 
  // Encode the payload (which includes the user data and standard claims) as a JSON string and then convert it to base64, this is also a standard part of the JWT structure, where the payload is encoded in base64 format.
  const signature = ""; // No signature for local-only tokens

  return `${headerEncoded}.${payloadEncoded}.${signature}`; 
  // Return the token in the standard JWT format (header.payload.signature), since we are not signing the token, the signature part is just an empty string, this token can be used for local authentication purposes, but should not be used in production or with sensitive data since it is not secure.
};

const decodeToken = (token) => { 
  // ⁡⁣⁣⁢𝗗𝗲𝗰𝗼𝗱𝗲 𝗮 𝗝𝗪𝗧 𝘁𝗼𝗸𝗲𝗻 𝘁𝗼 𝗲𝘅𝘁𝗿𝗮𝗰𝘁 𝘁𝗵𝗲 𝗽𝗮𝘆𝗹𝗼𝗮𝗱, 𝘁𝗵𝗶𝘀 𝗳𝘂𝗻𝗰𝘁𝗶𝗼𝗻 𝘁𝗮𝗸𝗲𝘀 𝗮 𝗝𝗪𝗧 𝘁𝗼𝗸𝗲𝗻 𝗮𝘀 𝗶𝗻𝗽𝘂𝘁 𝗮𝗻𝗱 𝗮𝘁𝘁𝗲𝗺𝗽𝘁𝘀 𝘁𝗼 𝗱𝗲𝗰𝗼𝗱𝗲 𝗶𝘁 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝘁𝗵𝗲 𝗽𝗮𝘆𝗹𝗼𝗮𝗱, 𝗶𝘁 𝘀𝗽𝗹𝗶𝘁𝘀 𝘁𝗵𝗲 𝘁𝗼𝗸𝗲𝗻 𝗶𝗻𝘁𝗼 𝗶𝘁𝘀 𝘁𝗵𝗿𝗲𝗲 𝗽𝗮𝗿𝘁𝘀 (𝗵𝗲𝗮𝗱𝗲𝗿, 𝗽𝗮𝘆𝗹𝗼𝗮𝗱, 𝘀𝗶𝗴𝗻𝗮𝘁𝘂𝗿𝗲), 𝗱𝗲𝗰𝗼𝗱𝗲𝘀 𝘁𝗵𝗲 𝗽𝗮𝘆𝗹𝗼𝗮𝗱 𝗳𝗿𝗼𝗺 𝗯𝗮𝘀𝗲𝟲𝟰, 𝗮𝗻𝗱 𝗽𝗮𝗿𝘀𝗲𝘀 𝗶𝘁 𝗮𝘀 𝗝𝗦𝗢𝗡 𝘁𝗼 𝗿𝗲𝘁𝘂𝗿𝗻 𝘁𝗵𝗲 𝗼𝗿𝗶𝗴𝗶𝗻𝗮𝗹 𝗱𝗮𝘁𝗮 𝘁𝗵𝗮𝘁 𝘄𝗮𝘀 𝗲𝗻𝗰𝗼𝗱𝗲𝗱 𝗶𝗻 𝘁𝗵𝗲 𝘁𝗼𝗸𝗲𝗻, 𝗶𝗳 𝘁𝗵𝗲 𝘁𝗼𝗸𝗲𝗻 𝗶𝘀 𝗺𝗮𝗹𝗳𝗼𝗿𝗺𝗲𝗱 𝗼𝗿 𝗰𝗮𝗻𝗻𝗼𝘁 𝗯𝗲 𝗱𝗲𝗰𝗼𝗱𝗲𝗱, 𝗶𝘁 𝗿𝗲𝘁𝘂𝗿𝗻𝘀 𝗻𝘂𝗹𝗹.⁡
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1])); // Decode the payload part of the token from base64 and parse it as JSON to retrieve the original data that was encoded in the token, this is where we extract the user information and standard claims (like iat and exp) that were included in the token when it was generated.
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const isTokenValid = (token) => { 
  // ⁡⁣⁢⁣𝗖𝗵𝗲𝗰𝗸 𝗶𝗳 𝗮 𝗝𝗪𝗧 𝘁𝗼𝗸𝗲𝗻 𝗶𝘀 𝘃𝗮𝗹𝗶𝗱 𝘂𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝘁𝗼𝗸𝗲𝗻'𝘀 𝘁𝗶𝗺𝗲𝘀𝘁𝗮𝗺ps, 𝘁his function takes a JWT token as input and checks if it is valid by decoding the token to extract the payload, then it checks the expiry time (exp) in the payload against the current time to determine if the token is still valid or has expired, if the token is malformed or cannot be decoded, it returns false.
  const payload = decodeToken(token);
  if (!payload) return false;

  const now = Date.now();
  return payload.exp > now;
};

const getTokenExpiryTime = (token) => { // ⁡⁣⁢⁣𝗚𝗲𝘁 𝗧𝗼𝗸𝗲𝗻 𝗘𝘅𝗽𝗶𝗿𝘆 𝗧𝗶𝗺𝗲, 𝘁his function takes a JWT token as input and decodes it to extract the payload, then it retrieves the expiry time (exp) from the payload and returns it as a Date object, if the token is malformed or cannot be decoded, it returns null.
  const payload = decodeToken(token); 
  if (!payload) return null;
  return new Date(payload.exp); // Convert the expiry timestamp to a Date object for easier handling, this allows us to work with the expiry time in a more human-readable format and perform date comparisons if needed.
};

export { generateToken, decodeToken, isTokenValid, getTokenExpiryTime };
