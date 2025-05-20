'use strict';

var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var ProductMgr = require('dw/catalog/ProductMgr');
var currentSite = require('dw/system/Site').getCurrent();
var collections = require('*/cartridge/scripts/util/collections');
var prodIter,fileWriter,productArray = [];

/**
 * Initializes resources and configurations before processing the product feed.
 * @param {Object} parameters - Configuration parameters for the job.
 */
function beforeStep(params) {
    var fileName = currentSite.ID + '_pulpo' + '.json';
    var writeFolderPath = [File.IMPEX, params.ExportPath].join(File.SEPARATOR);
    var writeFolder = new File(writeFolderPath);

    var writeFilePath = [writeFolderPath, fileName].join(File.SEPARATOR);
    var writeFile = new File(writeFilePath);

    if (!writeFolder.exists()) {
        writeFolder.mkdirs();
    }

    if (writeFile.exists()) {
        writeFile.remove();
    }

    writeFile.createNewFile();

    fileWriter = new FileWriter(writeFile);
    fileWriter.write('{"products":');

    prodIter = ProductMgr.queryAllSiteProducts();
}

/**
 * Returns the total count of site products.
 * @returns {number} The total number of products.
 */
function getTotalCount() {
    return prodIter.getCount();
}

/**
 * Reads the next product from the site products iterator.
 * @returns {Object|null} The next product or null if no more products are available.
 */
function read() {
    if (prodIter.hasNext()) {
        return prodIter.next();
    }
    return null;
}

/**
 * Processes a given product and returns its enriched representation for the feed.
 * @param {Object} apiProduct - The product.
 * @returns {Object|null} Enriched representation of the product or null if the product is not suitable for the feed.
 */
function process(apiProduct, params) {
    if ((params.ProcessProducts === 'ENABLED' && apiProduct.custom.enablePulpoAR) || params.ProcessProducts === 'ALL') {
        if (apiProduct.master) {
            return apiProduct;
        }
    }
    return {};
}

/**
 * Writes the provided products to the XML feed.
 * @param {Object} products - An iterable object containing products.
 * @param {Object} params - Configuration parameters for the export
 */
function write(products, params) {
    collections.forEach(products, function (product) {
        var productObj = {};
        if (product instanceof dw.catalog.Product) {
            var prodImg = product.getImage('large');
            productObj.id = product.ID;
            productObj.name = product.name;
            productObj.image = prodImg ? prodImg.absURL.toString() : '';
            productObj.slug = product.ID;
            if (product.variants.length > 0) {
                var variants = [];
                collections.forEach(product.variants, function(variantProduct) {
                    if (variantProduct.online) {
                        var variant = {};
                        var variantImg = variantProduct.getImage('large');
                        var variationValue = variantProduct.variationModel.getVariationValue(variantProduct, variantProduct.variationModel.productVariationAttributes[0]);
                        variant.id = variantProduct.ID;
                        variant.name = variantProduct.name;
                        variant.image = variantImg ? variantImg.absURL.toString() : '';
                        variant.thumbnail_color = variantProduct.custom.thumbnailColor;
                        variant.slug = variationValue.value;
                        variant.custom_slug = variantProduct.ID;
                        variant.barcode = variant.EAN;
                        variants.push(variant);
                    }
                });
                productObj.variants = variants;
            }
            productObj.brand = {};
            var brand = product.brand ? product.brand.toLowerCase().trim().replace(' ','-') : '';
            productObj.brand.id = brand;
            productObj.brand.name = product.brand;
            productObj.brand.image = product.custom.brandImg ? product.custom.brandImg.absURL.toString() : '';
            productObj.brand.slug = brand;
            productObj.brand.custom_slug = '';
            productObj.category = {};
            productObj.category.id = product.primaryCategory ? product.primaryCategory.ID : '';
            productObj.category.name = product.primaryCategory ? product.primaryCategory.displayName : '';
            productObj.category.image = product.primaryCategory ? product.primaryCategory.image.absURL.toString() : '';
            productObj.category.slug = productObj.category.id;
            productObj.category.custom_slug = '';
            productArray.push(productObj);
        }
    });
}

/**
 * Finalizes the XML product feed after processing.
 * @param {boolean} success - Indicates if the previous step was successful.
 */
function afterStep(success) {
    if (fileWriter) {
        if (productArray.length > 0) {
            fileWriter.write(JSON.stringify(productArray));
        }
        fileWriter.write('}');
        fileWriter.close();
    }

    if (prodIter) {
        prodIter.close();
    }
}

module.exports = {
    beforeStep: beforeStep,
    getTotalCount: getTotalCount,
    read: read,
    process: process,
    write: write,
    afterStep: afterStep
};
