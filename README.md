# plugin\_pulpoar (SFRA)

This is the repository for the plugin\_pulpoar cartridge. This plugin enhances the app\_storefront\_base cartridge by integrating PulpoAR Virtual Try-on.

### Update Site Cartridge Path(s)

The cartridge requires the `app_storefront_base` cartridge from [Storefront Reference Architecture](https://github.com/salesforceCommerceCloud/storefront-reference-architecture).

To update your site cartridge path:

1. Log in to Business Manager.
2. Go to **Administration** > **Sites** > **Manage Sites**.
3. Select the site where you want to use this cartridge. Example site identifier: `RefArch`.
4. Click the **Settings** tab.
5. In the **Cartridges** field, add the new cartridge path: `plugin_pulpoar`. It must be added _before_ the path for `app_storefront_base`. Example path: `plugin_pulpoar:app_storefront_base`
6. Click **Apply**

### Import Custom Metadata

1. Zip the [metadata](./metadata) folder with any zip tool.
2. Log in to Business Manager
3. Go to **Administration** > **Site Development** > **Site Import & Export**
4. Click **Browse**
5. Select the `metadata.zip` file from the root of the repo
6. Click **Upload**
7. Select `instance/metadata.zip`
8. Click **Import**
9. Click **OK**

# Template Conflicts

Each template in the following table is present in multiple cartridges. If the file exists in the app\_storefront\_base cartridge and in this plugin cartridge, the plugin template overrides the base template. The presence of a template file in multiple plugin cartridges indicates a conflict that you have to resolve in a customization cartridge. However, if you are using only one of the conflicting plugin cartridges, no action is necessary.

| Template File | Cartridge | Location |
| :--- | :--- | :--- |
|productDetails.isml|app\_storefront\_base|cartridge/templates/default/product/productDetails.isml|
|productDetails.isml|app\_storefront\_base|cartridge/templates/default/product/components/descriptionAndDetails.isml|


# Getting Started

1. Clone this repository. (The name of the top-level folder is plugin\_pulpoar.)
2. In the top-level plugin\_pulpoar folder, enter the following command: `npm install`. (This command installs all of the package dependencies required for this plugin.)
3. In the top-level plugin\_pulpoar folder, edit the paths.base property in the package.json file. This property should contain a relative path to the local directory containing the Storefront Reference Architecture repository. For example:
```
"paths": {
    "base": "../storefront-reference-architecture/cartridges/app_storefront_base/"
  }
```
4. In the top-level plugin\_pulpoar folder, enter the following command: `npm run compile:js && npm run compile:scss`
5. Use any WebDav client to upload your cartridge like Prophet or CyberDuck.


# NPM scripts

* Use the provided NPM scripts to compile the cartridge.

## Compiling your application

* npm run compile:scss - Compiles all scss files into css.
* npm run compile:js - Compiles all js files and aggregates them.

## Linting your code

* npm run lint - Execute linting for all JavaScript and SCSS files in the project. You should run this command before committing your code.


