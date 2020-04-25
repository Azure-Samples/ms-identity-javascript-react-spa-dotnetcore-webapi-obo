import { UserAgentApplication } from "msal";

export const msalApp = new UserAgentApplication({
    auth: {
        clientId: "5ca9feff-f691-4b28-8e85-bb49059e91b0",
        authority: "https://login.microsoftonline.com/common",
        validateAuthority: true,
        postLogoutRedirectUri: "http://localhost:3000",
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
});

export const apiConfig = {
    resourceUri: "",
    resourceScope: []
}

export const loginRequest = {
    scopes: ["openid", "profile"]
}

export const tokenRequest = {
    scopes: apiConfig.resourceScopes
}