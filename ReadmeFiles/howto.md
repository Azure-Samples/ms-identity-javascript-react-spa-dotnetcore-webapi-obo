# How to use this sample with work and school accounts

The note about azure work accounts is entirely due to this particular scenario and how the sample was configured. Other than that, there is nothing preventing you from using it with work accounts, with a little bit of modification.

So the first thing to change is to use the **tenanted enpoint** (i.e. with your tenantId), instead of the `/customers` endpoint (works only with personal MS accounts).

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

And finally, get rid of the ID crunching logic in `line 85: ProfileController.cs` (which we only used because of how object Id is represented for personal MS accounts)

```csharp
        // int x = 32 - profile.Id.Length;
        // string graphID = new string('0', x) + profile.Id;

        profileItem.Id = profile.Id;
```

You should then be good to go.
