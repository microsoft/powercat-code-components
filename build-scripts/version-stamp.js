// To test from commandline use the following from the repo root directory
// node build-scripts/version-stamp.test.js
module.exports = ({ majorVersion, minorVersion, buildVersion, manifestsPaths, solutionPaths, beta }) => {
    const fs = require("fs");
    const path = require("path");

    // Use the format YYMM for minor version if minorVersion = -1
    if (minorVersion.toString() == "-1") {
        const today = new Date();
        minorVersion = today.toISOString().substring(2, 4) + today.toISOString().substring(5, 7);
    }
    // Update the control versions in the manifest files
    // The resx assumes that the resx/css/React/Fluent versions are in a particular format
    // to prevent matches so this isn't ideal
    // TODO: rework to use xml parsing rather than regex
    const replace = require("replace-in-file");
    const resultsManifest = replace.sync({
        files: manifestsPaths.map(f => f + "/ControlManifest.Input.xml"),
        from: /(?<!(resx" )|(css" )|(React" )|(Fluent" ))version="[0-9]+.[0-9]+.[0-9]+"/g,
        to: `version="${majorVersion}.${minorVersion}.${buildVersion}"`,
        countMatches: true,
    });
    console.log(resultsManifest);

    // Update the versions in the resx files for displaying the version to the maker
    // There is no current way for a maker to see the current version loaded into an app
    const resultsResx = replace.sync({
        files: manifestsPaths.map(f => f + "/strings/*.resx"),
        from: /\%VERSION\%/g,
        to: beta ? `${majorVersion}.${minorVersion}.${buildVersion}-beta`:`${majorVersion}.${minorVersion}.${buildVersion}`,
        countMatches: true,
    });
    console.log(resultsResx);

    // Update the versions in the solution files
    // As above, this would be better if we used xml parsing to ensure the correct verison element is updated
    const resultsSolution = replace.sync({
        files: solutionPaths,
        from: /\<Version\>[0-9]+.[0-9]+.[0-9]+.[0-9]+\<\/Version>/g,
        to: `<Version>${majorVersion}.${minorVersion}.0.${buildVersion}</Version>`,
        countMatches: true,
    });
    console.log(resultsSolution);
};
