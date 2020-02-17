![](https://github.com/ztrank/azimuth-api/workflows/Unit%20Tests/badge.svg)
# Core
Provides an extensible framework design around ease of use to remove much of the boiler plate code for web APIs.

## Installation
`npm install --save @ztrank/azimuth-core`

## Getting Started
1. Create an interface to extend `IAppConfig`
1. Create an `application.ts` file and extend `Application`, `HttpApplication`, or `ExpressApplication` or any other provided application types
1. Create a `Core.Module.ts` file, use the `Core.Module.ts` file from this project as an example
   - Implement any missing assemblies from the `Core.Module.ts` file in this project, these are left open because they are required, but must be implemented by your application
   - Fill in the missing assemblies with your implementations
   - Change any assembly you wish to extend
   - (Manditory) assign your class from `application.ts` to the module Core's IApplication assembly
1. Create a `Feature.Module.ts` file for your own IModules
1. Create an `app.config.ts` file at project root that implements the `IAppConfig` interface
   - Reference the `Core.Module.ts` file from step 2 in the `modules` property
   - Reference the `Feature.Module.ts` file from step 3 in the `modules` property
1. Create an `index.ts` file
   - import your `app.config.ts`
   - Create a new inversify `Container`
   - Call `Main(__dirname, AppConfig, container)`
   - Handle the returned `Promise`

## Feature Modules
It is recommended that all feature's have a module that is imported by the main `Feature Module` and eventually referenced in your `app.config.ts` file.

## Advanced

For more information, details, and extensibility information checkout the [wiki](https://github.com/ztrank/azimuth-core.wiki.git).

