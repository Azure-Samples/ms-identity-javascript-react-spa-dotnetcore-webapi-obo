---
page_type: sample
languages:
- javascript
- csharp
products:
- msal-react
- ms-graph
- azure-active-directory
- dotnet-core
- react
- redux
description: "This sample demonstrates a React & Redux single-page application authorizing an ASP.NET Core web API to call MS Graph API on its behalf using the MS Graph SDK"
urlFragment: "ms-identity-javascript-react-spa-dotnetcore-webapi-obo"
---

# A React & Redux single-page application authorizing an ASP.NET Core web API to call Microsoft Graph using on-behalf-of flow

## Overview

This sample demonstrates a React & Redux single-page application which lets a user authenticate and then obtain an access token to call an ASP.NET Core web API, protected by [Azure Active Directory (Azure AD)](https://azure.microsoft.com/services/active-directory/). The web API then calls the [Microsoft Graph API](https://developer.microsoft.com/graph) on the signed-in user's behalf using the [OAuth 2.0 on-behalf-of flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). The web API's call to Microsoft Graph is made using the [MS Graph SDK](https://docs.microsoft.com/graph/sdks/sdks-overview).

> :information_source: This sample is configured to allow sign-ins with *personal Microsoft accounts* **ONLY** using the `/consumers` endpoint. If you would like to allow sign-ins with work and school accounts in your tenant, see [this note](./ReadmeFiles/howto-common.md). Learn more about [supported account](https://docs.microsoft.com/azure/active-directory/develop/v2-supported-account-types) types and [validation differences between them](https://docs.microsoft.com/azure/active-directory/develop/supported-accounts-validation).

## Key concepts

This sample demonstrates the following Azure AD and Microsoft Identity Platform workflows:

- How to sign-in & sign-out.
- How to acquire an access token.
- How to recognize a user from the **oid** claim in ID Tokens.
- How to protect and call a web API.
- How to authorize web API a to act on a user's behalf to call another web API.

### Scenario

- The sample implements an **onboarding** scenario where a profile is created for a new user whose fields are pre-populated by the available information about the user on Microsoft Graph.
- The **ProfileSPA** uses [MSAL React (Preview)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react) to authenticate a user and [React-Redux](https://react-redux.js.org/) to store id and access tokens. (:warning: if you do use [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension), remember to disable it in production to avoid exposing your store.)
- Once the user authenticates, **ProfileSPA** obtains an [access token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens) from Azure AD.
- The access token is then used to authorize the **ProfileAPI** to call MS Graph API **on user's behalf**. In order to call MS Graph API, **ProfileAPI** uses the [MS Graph SDK](https://docs.microsoft.com/graph/sdks/sdks-overview).
- To protect its endpoint and accept only the authorized calls, the ProfileAPI uses [MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) and [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web).

![Topology](./ReadmeFiles/topology.png)

### Contents

| File/folder          | Description                                               |
|----------------------|-----------------------------------------------------------|
| `AppCreationScripts` | Contains Powershell scripts to automate app registration. |
| `ReadmeFiles`        | Contains illustrations and misc. files.                   |
| `ProfileAPI`         | Source code of the ProfileAPI project.                    |
| `ProfileSPA`         | Source code of the ProfileSPA project.                    |

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) must be installed to run this sample.
- [Dotnet Core SDK](https://dotnet.microsoft.com/download) must be installed to run this sample.
- An Azure Active Directory (Azure AD) tenant. For more information on how to get an Azure AD tenant, see [How to get an Azure AD tenant](https://azure.microsoft.com/documentation/articles/active-directory-howto-tenant/).
- A **personal Microsoft account** is needed. This sample will not work with **work or school accounts** (see [note](./ReadmeFiles/howto-common.md)).
- [VS Code](https://code.visualstudio.com/download) for running and debugging this cross-platform application.
- [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) browser extension for monitoring your Redux store (:warning: remember to disable it in production)

### Steps

Using a command line interface such as [VS Code integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal), follow the steps below:

#### Step 1. Clone or download this repository

From your shell or command line:

```Shell
    git clone https://github.com/Azure-Samples/ms-identity-javascript-react-spa-dotnetcore-webapi-obo.git
```

or download and extract the repository .zip file.

> :warning: Given that the name of the sample is quiet long, and so are the names of the referenced NuGet packages, you might want to clone it in a folder close to the root of your hard drive, to avoid the 256 character path length limitation on Windows.

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
  - **automatically** creates the Azure AD applications and related objects (passwords, permissions, dependencies) for you.
  - modify the projects' configuration files.

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

</details>

#### Register the service: ProfileAPI

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. When the **Register an application page** appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `ProfileAPI`.
   - Change **Supported account types** to **Personal Microsoft accounts only**.
   - Select **Register** to create the application.
1. On the app **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the configuration file for this projects.
1. From the **Certificates & secrets** page, in the **Client secrets** section, choose **New client secret**:
   - Type a key description (of instance `app secret`),
   - Select a key duration of either **In 1 year**, **In 2 years**, or **Never Expires**.
   - When you press the **Add** button, the key value will be displayed, copy, and save the value in a safe location.
   - You'll need this key later to configure the project. This key value will not be displayed again, nor retrievable by any other means,
     so record it as soon as it is visible from the Azure portal.
1. Select the **API permissions** section
   - Click the **Add a permission** button and then,
   - Ensure that the **Microsoft APIs** tab is selected
   - In the *Commonly used Microsoft APIs* section, click on **Microsoft Graph**
   - In the **Delegated permissions** section, ensure that the right permissions are checked: **User.Read** and **offline_access**. Use the search box if necessary.
   - Select the **Add permissions** button.
1. Select the **Expose an API** section, and:
   - Click **Set** next to the Application ID URI to generate a URI that is unique for this app (in the form of `api://{clientId}`).
   - Select **Add a scope**
   - Enter the following parameters
     - for **Scope name** use `access_as_user`
     - Keep **Admins and users** for **Who can consent**
     - in **User consent display name** type `Access ProfileAPI as a user`
     - in **User consent description** type `Accesses the ProfileAPI web API as a user`
     - Keep **State** as **Enabled**
     - Select **Add scope**

##### Configure the service app (ProfileAPI) to use your app registration

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `ProfileAPI\appsettings.json` file
1. Find the app key `Domain` and replace the existing value with your Azure AD tenant name.
1. Find the app key `ClientId` and replace the existing value with the application ID (clientId) of the `ProfileAPI` application copied from the Azure portal.
1. Find the app key `ClientSecret` and replace the existing value with the Client Secret of the `ProfileAPI` application copied from the Azure portal.

#### Register the client: ProfileSPA

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. When the **Register an application page** appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `ProfileSPA`.
   - Change **Supported account types** to **Personal Microsoft accounts only**.
   - Select **Register** to create the application.
1. On the app **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the configuration file for this projects.
1. From the app's Overview page, select the **Authentication** section.
   - Click **Add a platform** button.
   - Select **Single-page Applications** on the right blade.
   - Add a **Redirect URIs**, for instance `http://localhost:3000`.
   - Click **Configure**.
1. Select the **API permissions** section
   - Click the **Add a permission** button and then,
   - Ensure that the **My APIs** tab is selected
   - In the list of APIs, select the `ProfileAPI` API, or the name you entered for the web API
   - In the **Delegated permissions** section, ensure that the right permissions are checked: **access_as_user**. Use the search box if necessary.
   - Select the **Add permissions** button.
1. Now you need to leave the registration for `ProfileSPA` and **go back** to your app registration for `ProfileAPI`.
    - From the app's Overview page, select the **Manifest** section.
    - Find the entry for `KnownClientApplications`, and add the **Application (client) ID** of the `ProfileSPA` application copied from the Azure portal.
    i.e. `KnownClientApplications: [ "your-client-id-for-ProfileSPA" ]`

##### Configure the client app (ProfileSPA) to use your app registration

>In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `ProfileSPA\src\authConfig.js` file
1. Find the key `clientId` and replace the existing value with the application ID (clientId) of the `ProfileSPA` application copied from the Azure portal.
1. Find the key `redirectUri` and replace the existing value with the base address of the ProfileSPA project (by default `http://localhost:3000/`).
1. Find the key `resourceUri` and replace the existing value with the base address of the ProfileAPI project (by default `https://localhost:44351/api/profile`).
1. Find the key `resourceScopes` and replace the existing value with the scope you created earlier e.g. `api://{client_id}/.default`.

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

1. Open your browser and navigate to `http://localhost:3000`.
2. Sign-in using the button on top-right corner.
3. If this is your first sign-in, you will be redirected to the onboarding page (the app will try to make a **GET** request: if this is the first time, it will fail -this is expected).
4. Hit **Accept** and a new account will be created for you in the database, pre-populated by the information about you fetched from Microsoft Graph.
5. Submit your changes. When you sign-in next time, the application will recognize you and show you the profile associated with your ID in the database.

![Screenshot](./ReadmeFiles/screenshot.png)

> :information_source: Consider taking a moment to [share your experience with us](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUM1QwMTZZSDMwSE81MEw5QzQ5SzM4WjZZQyQlQCN0PWcu). If the sample did not work for you as expected, then please reach out to us using the [GitHub Issues](../issues) page.

## Debugging the sample

To debug the .NET Core web API that comes with this sample, install the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.

Learn more about using [.NET Core with Visual Studio Code](https://docs.microsoft.com/dotnet/core/tutorials/with-visual-studio-code).

## More information

For more information, visit the following links:

- Articles about the Microsoft identity platform are at [http://aka.ms/aaddevv2](http://aka.ms/aaddevv2), with a focus on:
  - [Microsoft identity platform OAuth 2.0 authorization code flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow)
  - [The OpenID Connect protocol](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc)
  - [Azure AD OAuth Bearer protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-protocols)
  - [Access token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens)
  - [Secure a web API with Azure AD](https://docs.microsoft.com/azure/active-directory/develop/scenario-protected-web-api-overview)

- To lean more about the application registration, visit:
  - [Quickstart: Register an application with the Microsoft identity platform (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)
  - [Quickstart: Configure a client application to access web APIs (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-access-web-apis)
  - [Quickstart: Configure an application to expose web APIs (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-expose-web-apis)

## Community Help and Support

Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`ms-identity` `msal` `dotnet` `react` `azure-active-directory`].

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
