import { UserAgentApplication } from "msal";

// For a full list of msal.js configuration parameters, 
// visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
export const msalApp = new UserAgentApplication({
    auth: {
        clientId: "8d3c81bf-3fcd-432d-b7f1-c3ac769b6d3e",
        authority: "https://login.microsoftonline.com/consumers",
        validateAuthority: true,
        redirectUri: "http://localhost:3000",
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
    },
});

// Coordinates and required scopes for your web api
export const apiConfig = {
    resourceUri: "https://localhost:44351/api/profile",
    resourceScope: "api://fdea4330-5197-4aab-8346-a3a8a0b1599e/.default"
}

/** 
 * Scopes you enter here will be consented once you authenticate. For a full list of available authentication parameters, 
 * visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
 */
export const loginRequest = {
    scopes: ["openid", "profile"]
}

// Add here scopes for access token to be used at the API endpoints.
export const tokenRequest = {
    scopes: [apiConfig.resourceScope, "offline_access"]
}
