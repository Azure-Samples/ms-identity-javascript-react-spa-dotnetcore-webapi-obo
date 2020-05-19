---
page_type: sample
languages:
- javascript
- csharp
products:
- react
- redux
- dotnet
description: "This sample demonstrates a React & Redux SPA application calling a ASP.NET Core Web API that is secured using Azure Active Directory"
urlFragment: "ms-identity-javascript-react-spa-dotnetcore-webapi-obo"
---

# A React & Redux single-page application authorizing an ASP.NET Core Web API to call MS Graph API on behalf of a signed in user

## About this sample

### Overview

This sample demonstrates a React & Redux single-page application which lets a user authenticate and then obtain an access token to call an ASP.NET Core Web API, protected by [Azure AD](https://azure.microsoft.com/services/active-directory/). The Web API then calls the [MS Graph API](https://developer.microsoft.com/graph) on the user's behalf using the [on-behalf-of flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow).

The Wen APIs call to MS Graph API is made using the [MS Graph SDK](https://docs.microsoft.com/graph/sdks/sdks-overview).

> Looking for previous versions of this code sample? Check out the tags on the [releases](../../releases) GitHub page.

### Scenario

- The sample implements an **onboarding** scenario where a profile is created for a new user whose fields are pre-populated by the available information about that user in MS Graph.
- `ProfileSPA` app uses [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js) to authenticate the user and [React-Redux](https://react-redux.js.org/) to store id and access tokens.
- Once the user authenticates, `ProfileSPA` obtains an [access token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens) from Azure Active Directory (Azure AD) for the `ProfileAPI` Web API.
- The access token is then used to authorize the `ProfileAPI` to call the MS Graph API **on user's behalf**. In order to call MS Graph , `ProfileAPI` uses the [MS Graph SDK](https://docs.microsoft.com/graph/sdks/sdks-overview).
- To protect its endpoint and accept only the authorized calls, the `ProfileAPI` uses the [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web) library.

![Topology](./ReadmeFiles/topology.png)

> [!NOTE]
> This sample is configured to allow sign-ins with **Personal Microsoft Accounts** ONLY using the `/consumers` endpoint. Learn more about [supported accounts](https://docs.microsoft.com/azure/active-directory/develop/v2-supported-account-types) types and [validation differences between them](https://docs.microsoft.com/azure/active-directory/develop/supported-accounts-validation).

### Contents

| File/folder       | Description                                |
|-------------------|--------------------------------------------|
| `AppCreationScripts` | Contains Powershell scripts to automate app registration. |
| `ReadmeFiles` | Sample readme files.                          |
| `ProfileAPI` | Source code of the ProfileAPI.  |
| `ProfileSPA` | Source code of the ProfileSPA.  |
| `CHANGELOG.md`    | List of changes to the sample.             |
| `CONTRIBUTING.md` | Guidelines for contributing to the sample. |
| `README.md`       | This README file.                          |
| `LICENSE`         | The license for the sample.                |

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) must be installed to run this sample.
- [Dotnet Core SDK](https://dotnet.microsoft.com/download) must be installed to run this sample.
- An Azure Active Directory (Azure AD) tenant. For more information on how to get an Azure AD tenant, see [How to get an Azure AD tenant](https://azure.microsoft.com/documentation/articles/active-directory-howto-tenant/).
- A **personal Microsoft account** is needed. This sample will not work with **work or school accounts**.
- We recommend the [VS Code](https://code.visualstudio.com/download) for running and debugging this cross-platform application.
- We recommend the [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) browser extension for monitoring your Redux store.

### Steps

Using a command line interface such as [VS Code integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal), follow the steps below:

#### Step 1. Clone or download this repository

From your shell or command line:

```Shell
git clone https://github.com/Azure-Samples/ms-identity-javascript-react-spa-dotnetcore-webapi-obo.git
```

or download and extract the repository .zip file.

> Given that the name of the sample is quiet long, and so are the names of the referenced NuGet packages, you might want to clone it in a folder close to the root of your hard drive, to avoid the 256 character path length limitation on Windows.

#### Step 2. Install .NET Core API dependencies

```console
cd ProfileAPI
dotnet restore
```

#### Step 3. Trust development certificates

```console
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

Learn more about [HTTPS in .NET Core](https://docs.microsoft.com/aspnet/core/security/enforcing-ssl).

#### Step 4. Install Angular SPA dependencies

```console
cd ProfileSPA
npm install
```

### Step 4:  Register the sample application with your Azure Active Directory tenant

There are two projects in this sample. Each needs to be separately registered in your Azure AD tenant. To register these projects, you can:

- either follow the steps [Step 2: Register the sample with your Azure Active Directory tenant](#step-2-register-the-sample-with-your-azure-active-directory-tenant) and [Step 3:  Configure the sample to use your Azure AD tenant](#choose-the-azure-ad-tenant-where-you-want-to-create-your-applications)
- or use PowerShell scripts that:
  - **automatically** creates the Azure AD applications and related objects (passwords, permissions, dependencies) for you. Note that this works for Visual Studio only.
  - modify the Visual Studio projects' configuration files.

<details>
  <summary>Expand this section if you want to use this automation:</summary>

1. On Windows, run PowerShell and navigate to the root of the cloned directory
1. In PowerShell run:

   ```PowerShell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
   ```

1. Run the script to create your Azure AD application and configure the code of the sample application accordingly.
1. In PowerShell run:

   ```PowerShell
   cd .\AppCreationScripts\
   .\Configure.ps1
   ```

   > Other ways of running the scripts are described in [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md)
   > The scripts also provide a guide to automated application registration, configuration and removal which can help in your CI/CD scenarios.

1. Open the Visual Studio solution and click start to run the code.

</details>

Follow the steps below to manually walk through the steps to register and configure the applications in the Azure portal.

> [!NOTE]
> This sample uses a single Application Registration (i.e. App/Client Id) for both the Web API and the SPA projects.

#### Register the service: ProfileAPI

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. When the **Register an application page** appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `ProfileAPIandSPA`.
   - Change **Supported account types** to **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.
   - Select **Register** to create the application.
1. On the app **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the configuration file for this projects.
1. From the **Certificates & secrets** page, in the **Client secrets** section, choose **New client secret**:
   - Type a key description (of instance `app secret`),
   - Select a key duration of either **In 1 year**, **In 2 years**, or **Never Expires**.
   - When you press the **Add** button, the key value will be displayed, copy, and save the value in a safe location.
   - You'll need this key later to configure the project in Visual Studio. This key value will not be displayed again, nor retrievable by any other means,
     so record it as soon as it is visible from the Azure portal.
1. Select the **API permissions** section
   - Click the **Add a permission** button and then,
   - Ensure that the **Microsoft APIs** tab is selected
   - In the *Commonly used Microsoft APIs* section, click on **Microsoft Graph**
   - In the **Delegated permissions** section, ensure that the right permissions are checked: **User.Read**. Use the search box if necessary.
   - Select the **Add permissions** button
   - [Optional] if you are a tenant admin, and agree to grant the admin consent to the web api, select **Grant admin consent for {your tenant domain}**. If you don't do
    it, users will be presented a consent screen enabling them to consent to using the web api.
1. Select the **Expose an API** section, and:
   - Select **Add a scope**
   - Change the Application ID URI to the **https** pattern, [check AzureADandPersonalMicrosoftAccount restrictions](https://docs.microsoft.com/azure/active-directory/develop/supported-accounts-validation), (https://{tenant-domain}/{app-name}) and select **Save and Continue**.
   - Enter the following parameters
     - for **Scope name** use `access_as_user`
     - Keep **Admins and users** for **Who can consent**
     - in **Admin consent display name** type `Access ProfileAPI as a user`
     - in **Admin consent description** type `Accesses the ProfileAPI Web API as a user`
     - in **User consent display name** type `Access ProfileAPI as a user`
     - in **User consent description** type `Accesses the ProfileAPI Web API as a user`
     - Keep **State** as **Enabled**
     - Select **Add scope**

#### Register the client: ProfileSPA (in the same application registration)

1. On the app **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the configuration file for this project.
1. From the app's Overview page, select the **Authentication** section.
   - Click **Add a platform** button.
   - Select **Web Applications** on the right blade.
   - Add a **Redirect URIs**, for instance **http://localhost:3000**.
   - Click **Configure**.
1. Select the **API permissions** section
   - Click the **Add a permission** button and then,
   - Ensure that the **My APIs** tab is selected
   - In the list of APIs, select the `ProfileAPIandSPA` API, or the name you entered for the Web API.
   - In the **Delegated permissions** section, ensure that the right permissions are checked: **access_as_user**. Use the search box if necessary.
   - Select the **Add permissions** button

##### Configure the service app (ProfileAPI) to use your app registration

>In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `ProfileAPI\appsettings.json` file
1. Find the app key `Domain` and replace the existing value with your Azure AD tenant name.
1. Find the app key `ClientId` and replace the existing value with the application ID (clientId) of the `ProfileAPIandSPA` application copied from the Azure portal.
1. Find the app key `ClientSecret` and replace the existing value with the Client Secret of the `ProfileAPIandSPA` application copied from the Azure portal.

##### Configure the client app (ProfileSPA) to use your app registration

>In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `ProfileSPA\src\utils\authConfig.js` file
1. Find the app key `clientId` and replace the existing value with the application ID (clientId) of the `ProfileAPIandSPA` application copied from the Azure portal.
1. Find the app key `redirectUri` and replace the existing value with the base address of the ProfileSPA project (by default `http://localhost:3000/`).
1. Find the app key `resourceUri` and replace the existing value with the base address of the ProfileAPI project (by default `https://localhost:44351/api/profile/`).
1. Find the app key `resourceScope` and replace the existing value with *Scope* you created earlier `https://{tenant-domain}/access_as_user`.

### Run the sample

Using a command line interface such as VS Code integrated terminal, locate the application directory. Then:  

```console
cd ../
cd ProfileAPI
dotnet run
```

In a separate console window, execute the following commands

```console
cd ProfileSPA
npm start
```

### Explore the sample

1. Open your browser and navigate to http://localhost:3000.
2. Sign-in using the button on top-right corner.
3. If this is your first time sign-in, you will be redirected to the onboarding page.
4. Hit "Accept" and a new account will be created for you in the database, pre-populated by the available information on MS Graph API.
5. Submit your changes. When you sign-in next time, the application will recognize you and show you the profile associated with your Id in the database.

> [!NOTE]
> Did the sample not work for you as expected? Did you encounter issues trying this sample? Then please reach out to us using the [GitHub Issues](../issues) page.

## Debugging the sample

To debug the .NET Core Web API that comes with this sample, install the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.

Learn more about using [.NET Core with Visual Studio Code](https://docs.microsoft.com/dotnet/core/tutorials/with-visual-studio-code).

## Key concepts

This sample demonstrates the following Azure AD and Microsoft Identity Platform workflows:

- How to protect a Web API.
- How to configure application parameters.
- How to sign-in & sign-out.
- How to acquire an access token.
- How to recognize a user from an id token's "oid" claim.
- How to make a Web API call with the access token.
- How to authorize Web API a to act on a user's behalf.

## More information

For more information, visit the following links:

- Articles about the Microsoft identity platform are at [http://aka.ms/aaddevv2](http://aka.ms/aaddevv2), with a focus on:
  - [The OAuth 2.0 Implicit Grant in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-implicit-grant-flow)
  - [The OpenID Connect protocol](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc)
  - [Azure AD OAuth Bearer protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-protocols)
  - [Access token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens)
  - [Secure a Web API with Azure AD](https://docs.microsoft.com/azure/active-directory/develop/scenario-protected-web-api-overview)

- To lean more about the application registration, visit:
  - [Quickstart: Register an application with the Microsoft identity platform (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)
  - [Quickstart: Configure a client application to access web APIs (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-access-web-apis)
  - [Quickstart: Configure an application to expose web APIs (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-expose-web-apis)

## Community Help and Support

Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`msal` `dotnet` `angular` `azure-active-directory`].

If you find a bug in the sample, please raise the issue on [GitHub Issues](../../issues).

To provide a recommendation, visit the following [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
