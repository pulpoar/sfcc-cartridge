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
function process(apiProduct) {
    return apiProduct;
}

/**
 * Writes the provided products to the XML feed.
 * @param {Object} products - An iterable object containing products.
 * @param {Object} params - Configuration parameters for the export
 */
function write(products, params) {
    collections.forEach(products, function (product) {
        var productObj = {};
        if ((params.ProcessProducts === 'ENABLED' && product.custom.enablePulpoAR) || params.ProcessProducts === 'ALL') {
            // TODO: Add related product data when data format is decided.
            productObj.ID = product.ID;
            productObj.name = product.name;
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
