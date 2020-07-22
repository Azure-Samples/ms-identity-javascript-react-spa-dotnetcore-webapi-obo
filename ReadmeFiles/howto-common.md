
# How to configure this sample to allow sign-ins with work and school accounts

The first thing you need to do is to replace the `/customers` endpoint (Which works only with personal Microsoft accounts) with your Tenant ID.

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

Finally, remove the Id crunching logic in `line 85: ProfileController.cs` (which we only used because of how object Id is represented for personal MS accounts on MS Graph API):

```csharp
                    // int x = 32 - profile.Id.Length;
                    // string graphID = new string('0', x) + profile.Id;

                    profileItem.Id = profile.Id;
                    ...
```

After that, you should be able to sign with work and school accounts.
