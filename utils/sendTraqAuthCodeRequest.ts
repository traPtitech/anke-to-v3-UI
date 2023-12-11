import { sha256 } from 'js-sha256';

const baseUrl = 'https://q.trap.jp/api/v3/oauth2';

const getClientID = () => {
  const runtimeConfig = useRuntimeConfig();
  return runtimeConfig.public.traQClientId;
};

const randomString = (len: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  let array = crypto.getRandomValues(new Uint32Array(len));
  array = array.map((val) => characters.charCodeAt(val % charactersLength));
  return String.fromCharCode(...array);
};

const getCodeChallenge = (codeVerifier: string) => {
  const sha256Result = sha256(codeVerifier);
  const bytes = new Uint8Array(sha256Result.length / 2);
  for (let i = 0; i < sha256Result.length; i += 2) {
    bytes[i / 2] = parseInt(sha256Result.substring(i, i + 2), 16);
  }
  const base64 = btoa(String.fromCharCode(...bytes));
  const base64url = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return base64url;
};

export const getTraqAuthCodeRequestUrl = () => {
  const url = baseUrl + '/authorize';

  const state = randomString(10);
  const codeVerifier = randomString(43);
  const codeChallenge = getCodeChallenge(codeVerifier);

  sessionStorage.setItem(`traq-auth-code-verifier-${state}`, codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: getClientID(),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  return url + '?' + params.toString();
};

export const sendTraqAuthTokenRequest = (
  code: string,
  codeVerifier: string,
) => {
  const url = baseUrl + '/token';

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: getClientID(),
    code,
    code_verifier: codeVerifier,
  });

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'omit',
    body: body.toString(),
  });
};
