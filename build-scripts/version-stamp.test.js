console.debug(`Testing Versioning ${process.cwd()}`);
const versionStamp = require('./version-stamp');
const workspacePath = process.cwd();
versionStamp({
    majorVersion: 1,
    minorVersion: 1,
    buildVersion: 2,
    manifestsPaths: [
        `${workspacePath}/AutoWidthLabel/AutoWidthLabel`,
        `${workspacePath}/CommandBar/CommandBar`,
        `${workspacePath}/ContextMenu/ContextMenu`,
        `${workspacePath}/DetailsList/DetailsList`,
        `${workspacePath}/Elevation/Elevation`,
        `${workspacePath}/Icon/Icon`,
        `${workspacePath}/KeyboardShortcuts/KeyboardShortcuts`,
        `${workspacePath}/Nav/Nav`,
        `${workspacePath}/Picker/Picker`,
        `${workspacePath}/Pivot/Pivot`,
        `${workspacePath}/ResizableTextarea/ResizableTextarea`,
        `${workspacePath}/TagList/TagList`
    ],
    solutionPaths: `${workspacePath}/Solution/src/Other/Solution.xml`
});
