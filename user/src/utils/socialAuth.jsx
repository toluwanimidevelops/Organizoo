// Centralized Facebook + Apple SDK loading, shared by Login.jsx and
// Signup.jsx so the SDK is only ever loaded/initialized once per session,
// no matter which page mounts first or how many times you navigate
// between them.
//
// This also fixes "FB.login() called before FB.init()": that error means
// window.FB existed but init() hadn't actually finished yet — checking
// `if (window.FB)` only tells you the SDK object exists, not that it's
// ready. Here, login always awaits the same promise that resolves AFTER
// FB.init() actually runs, so there's no window where FB exists but
// isn't initialized yet.

export const FACEBOOK_APP_ID = "1634664801361771";
export const APPLE_CLIENT_ID = "YOUR_APPLE_SERVICES_ID"; // Services ID, not App ID
export const APPLE_REDIRECT_URI = "https://yourdomain.com/auth/apple/callback"; // must match Apple dashboard exactly

// --- Facebook ---

let fbSdkPromise = null;

export const loadFacebookSdk = () => {
  if (fbSdkPromise) return fbSdkPromise;

  fbSdkPromise = new Promise((resolve) => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v19.0",
      });
      resolve(window.FB);
    };

    // If a previous call (or a previous page) already injected the
    // script tag, don't add it again — just let fbAsyncInit above fire
    // once the existing script finishes loading.
    if (document.getElementById("facebook-jssdk")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });

  return fbSdkPromise;
};

// Call this directly from a click handler — it waits for init to
// actually finish before ever touching FB.login().
export const triggerFacebookLogin = async () => {
  await loadFacebookSdk();

  return new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken);
        } else {
          reject(new Error("Facebook login cancelled"));
        }
      },
      { scope: "email,public_profile" },
    );
  });
};

// --- Apple ---

let appleSdkPromise = null;

export const loadAppleSdk = () => {
  if (appleSdkPromise) return appleSdkPromise;

  appleSdkPromise = new Promise((resolve) => {
    if (document.getElementById("apple-jssdk")) {
      // Already injected by an earlier call — this script has no
      // reusable onload hook, so poll briefly until AppleID shows up.
      const check = setInterval(() => {
        if (window.AppleID) {
          clearInterval(check);
          resolve(window.AppleID);
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.id = "apple-jssdk";
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: "name email",
        redirectURI: APPLE_REDIRECT_URI,
        usePopup: true,
      });
      resolve(window.AppleID);
    };
    document.body.appendChild(script);
  });

  return appleSdkPromise;
};

export const triggerAppleLogin = async () => {
  await loadAppleSdk();
  const result = await window.AppleID.auth.signIn();

  return {
    identityToken: result.authorization.id_token,
    // Apple only sends the name on the person's FIRST-ever sign-in
    firstName: result.user?.name?.firstName,
    lastName: result.user?.name?.lastName,
  };
};