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

This import creates the following custom attributes and job definition:

**Product attributes** (under the **Pulpo AR Configs** group):

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `enablePulpoAR` | Boolean | Enables Virtual Try-on for this specific product. Required when the site preference is set to `YES FOR SELECTED PRODUCTS`. |
| `pulpoIntegrationStyle` | Enum (`popup`, `embed`, `image`) | Controls how the Virtual Try-on appears on this product's detail page. Defaults to `popup`. |
| `thumbnailColor` | String | Variant-level color value used in the product export feed. |
| `brandImg` | Image | Brand image used in the product export feed. |

**Site Preferences** (under the **Pulpo AR Configs** group):

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `enablePulpoAR` | Enum | Controls the activation scope. See Configuration Step 1. |
| `pulpoARSlug` | String | Your PulpoAR project slug. |
| `pulpoSDKurl` | String | URL to the PulpoAR plugin SDK script. |

# Template Conflicts

Each template in the following table is present in multiple cartridges. If the file exists in the app\_storefront\_base cartridge and in this plugin cartridge, the plugin template overrides the base template. The presence of a template file in multiple plugin cartridges indicates a conflict that you have to resolve in a customization cartridge. However, if you are using only one of the conflicting plugin cartridges, no action is necessary.

| Template File | Cartridge | Location |
| :--- | :--- | :--- |
|productDetails.isml|app\_storefront\_base|cartridge/templates/default/product/productDetails.isml|
|productDetails.isml|app\_storefront\_base|cartridge/templates/default/product/components/descriptionAndDetails.isml|

Additionally, `cartridge/client/default/js/main.js` is overridden to include the PulpoAR client script via `processInclude(require('./pulpo'))`. If another plugin cartridge also overrides `main.js`, the PulpoAR event handlers will not be loaded.

> **Note:** All VTO iframes include the `allow="camera *;"` attribute, which grants the embedded PulpoAR experience access to the shopper's camera for live try-on. If you customize any template that contains a VTO iframe, this attribute must be preserved — without it, the browser will block camera access and the try-on will not work.

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

---

# Configuration

## Step 1: Configure Site Preferences

After importing the metadata, go to **Merchant Tools** > **Site Preferences** > **Custom Preferences** and select the **Pulpo AR Configs** group.

### Enable Pulpo AR

| Value | Behavior |
| :--- | :--- |
| **NO** (default) | Virtual Try-on does not appear on any product detail page. |
| **YES FOR ALL PRODUCTS** | Virtual Try-on appears on every product detail page. |
| **YES FOR SELECTED PRODUCTS** | Virtual Try-on appears only on products where the product-level `enablePulpoAR` boolean is `true`. |
| **YES FOR PAGE DESIGNER ONLY** | Virtual Try-on does not appear on product detail pages. The Page Designer component remains available. |

### Pulpo AR Project Slug

Your PulpoAR project identifier. This value is used to build the Virtual Try-on iframe URLs:

```
https://plugin.pulpoar.com/vto/{slug}/product/{productId}
```

**Required.** If empty, the Virtual Try-on button and embeds will not appear on product detail pages — the controller disables VTO when the slug is missing.

### Pulpo AR SDK Url

The URL to the PulpoAR plugin SDK script. The cartridge injects this as a `<script>` tag in the page footer via the `app.template.afterFooter` hook.

> **Note:** The SDK URL is:
> ```
> https://cdn.jsdelivr.net/npm/@pulpoar/plugin-sdk@latest/dist/index.iife.js
> ```
> This is a lightweight ~2KB connector script. It exposes a global `pulpoar` object that the cartridge uses for add-to-cart, product navigation, and variant sync events between the storefront and the AR experience.

**Required for full functionality.** If empty, the SDK script is not loaded. The VTO iframes will still render, but the following features require the SDK:
- Add to cart from within the AR experience
- Navigate to a product page from the AR experience
- Color swatch synchronization between the product page and the AR experience

---

## Step 2: Configure Product Attributes

For each product that should display Virtual Try-on, open the product in Business Manager and configure the **Pulpo AR Configs** attribute group.

**Path:** **Merchant Tools** > **Products** > *(select a product)* > **Pulpo AR Configs**

### Enable Pulpo AR (product-level)

Only relevant when the site preference is set to **YES FOR SELECTED PRODUCTS**. Set to `true` on each product that should display VTO.

### Pulpo Integration Style

Controls how the Virtual Try-on experience appears on the product detail page:

| Value | Behavior |
| :--- | :--- |
| **Pop-Up** (`popup`) — default | A "Virtual Try-on" button appears below add-to-cart. Clicking it opens a Bootstrap modal with the VTO iframe (1080×720px). |
| **Embed to Details** (`embed`) | The VTO iframe is embedded as a collapsible section in the description and details area (100% width, 720px height). |
| **Embed to Images** (`image`) | A "Virtual Try-on" button appears below add-to-cart. Clicking it replaces the product image carousel with the VTO iframe (100% width, 720px height). Click again to toggle back. |

> **Important:** The product detail page controller reads `pulpoIntegrationStyle` from the product object before evaluating whether VTO is enabled. If this attribute has no value set on a product, the page will throw an error. Ensure `pulpoIntegrationStyle` is set on every product in your catalog — the default value `popup` is applied automatically by the metadata import, but verify this on existing products.

---

## Step 3: Product Export Job (Optional)

The cartridge includes a scheduled job that exports product catalog data as a JSON feed for PulpoAR's platform. This job is only needed if PulpoAR requires a catalog sync.

The job definition is included in `metadata/jobs.xml` and is imported with the metadata zip.

**Path:** **Administration** > **Operations** > **Jobs** > **Pulpo Product Export**

### Parameters

| Parameter | Default | Description |
| :--- | :--- | :--- |
| **ExportPath** | `src/export/pulpo` | IMPEX subdirectory for the output file. The file is named `{SiteID}_pulpo.json`. |
| **ProcessProducts** | `ENABLED` | `ENABLED` — export only master products where the product-level `enablePulpoAR` is `true`. `ALL` — export all master products in the catalog. |

### Output format

The job exports **master products only** (products where `apiProduct.master` is `true`). For each product, the JSON includes:

- `id`, `name`, `image` (large image URL), `slug` (same as product ID)
- `variants[]` — online variants only, each with: `id`, `name`, `image`, `thumbnail_color` (from `thumbnailColor` custom attribute), `slug` (first variation attribute value), `custom_slug` (variant product ID)
- `brand` — `id` (slugified), `name`, `image` (from `brandImg` custom attribute), `slug`
- `category` — primary category `id`, `name`, `image`, `slug`

### Scheduling

The imported job is disabled by default (one-time trigger, not enabled). To run it on a schedule:

1. Open the job in **Administration** > **Operations** > **Jobs** > **Pulpo Product Export**.
2. Go to the **Schedule** tab.
3. Configure a recurring trigger (e.g. daily).

---

## Step 4: Page Designer Component (Optional)

A Page Designer component called **"Pulpo AR"** is available under **Commerce Assets** for placing a standalone Virtual Try-on experience on any content page.

**Path:** **Merchant Tools** > **Page Designer** > edit a page > add component > **Commerce Assets** > **Pulpo AR**

| Component Attribute | Description |
| :--- | :--- |
| **Pulpo AR Project Slug** | Optional. Overrides the site-level `pulpoARSlug` for this component instance. If left empty, the site preference value is used. |

This component renders a project-level VTO experience — it is not tied to a specific product. The iframe URL is `https://plugin.pulpoar.com/vto/{slug}` (without a product ID).

The component works independently of the `enablePulpoAR` site preference — it only requires that `pulpoARSlug` is set (either at the site level or as a component-level override). If the slug is missing, a "Missing project slug" message is displayed instead.

---

# Client-Side Behavior

The cartridge bundles a client-side script (`pulpo.js`) into `main.js` that wires up the following behaviors automatically:

| Behavior | How it works |
| :--- | :--- |
| **Add to cart from AR** | The SDK's `onAddToCart` event fires when a shopper adds an item inside the AR experience. The cartridge posts to `Cart-AddProduct` with `pid` set to the item slug (uppercased) and `quantity: 1`. A success or error alert appears for 5 seconds and the minicart count updates. |
| **Go to product** | The SDK's `onGoToProduct` event fires when a shopper taps a product inside the AR experience. The page redirects to the product's `web_link` URL. |
| **Color swatch sync** | When a shopper clicks a color swatch on the product page, the cartridge calls `pulpoar.applyVariantsWithCatalog()` with the selected color value, so the AR model updates to match. This relies on the standard SFRA color swatch markup: `[data-attr="color"] button` containing a `span.color-value` element with a `data-attr-value` attribute. |
| **Image toggle** | In **Embed to Images** mode, the "Virtual Try-on" button (id `toggle-pulpo`) toggles visibility between the product image carousel and the VTO iframe. |

> **Note on product ID mapping:** The add-to-cart handler uses `item.slug.toUpperCase()` as the SFCC product ID. Ensure the slug configured in PulpoAR for each variant corresponds to the lowercase SFCC variant product ID.

---

# Quick Checklist

- [ ] Cartridge uploaded via WebDAV
- [ ] Cartridge path: `plugin_pulpoar` added before `app_storefront_base`
- [ ] Metadata imported (attributes, job definition)
- [ ] Site preference **Enable Pulpo AR** set to desired mode
- [ ] Site preference **Pulpo AR Project Slug** configured
- [ ] Site preference **Pulpo AR SDK Url** set to `https://cdn.jsdelivr.net/npm/@pulpoar/plugin-sdk@latest/dist/index.iife.js`
- [ ] For **YES FOR SELECTED PRODUCTS** mode: product-level `enablePulpoAR` set to `true` on each product
- [ ] `pulpoIntegrationStyle` set on products (`popup`, `embed`, or `image`)
- [ ] Product export job scheduled if catalog sync is needed
- [ ] No conflicting template overrides from other plugin cartridges
