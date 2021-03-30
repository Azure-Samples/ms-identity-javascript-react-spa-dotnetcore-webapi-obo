
# How to configure this sample to allow sign-ins with work and school accounts

The note about azure work and school accounts is entirely due to this particular scenario and how the sample was configured. Other than that, there is nothing preventing you from using it with work and school accounts, with a little bit of modification.

The first thing to change is to use the **tenanted endpoint** (i.e. `/<your_tenant_id>`), instead of the `/customers` endpoint (works only with personal Microsoft accounts e.g. @hotmail.com etc.).

In `ProfileAPI\appsettings.json`:

```json
    "AzureAd": {
        "Domain": "msaltestingjs.onmicrosoft.com",
        "ClientId": "YOUR_CLIENT_ID",
        "ClientSecret": "YOUR_CLIENT_SECRET",
        "Instance": "https://login.microsoftonline.com/",
        "TenantId": "YOUR_TENANT_ID"
    },
```

Then in `ProfileSPA\src\utils\authConfig.js`:

```javascript
    auth: {
        clientId: "YOUR_CLIENT_ID",
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
        validateAuthority: true,
        redirectUri: "http://localhost:3000",
        navigateToLoginRequestUrl: false
    },
```

Finally, remove the ID crunching logic in `line 85: ProfileController.cs` (which we only used because of how object ID is represented for personal Microsoft accounts on the Microsoft Graph API):

```csharp
                    // int x = 32 - profile.Id.Length;
                    // string graphID = new string('0', x) + profile.Id;

                    profileItem.Id = profile.Id;
                    ...
```

After that, you should be able to sign with work and school accounts.
