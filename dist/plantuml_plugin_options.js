"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typedoc_1 = require("typedoc");
/**
 * Supported image output formats.
 */
var ImageFormat;
(function (ImageFormat) {
    ImageFormat["PNG"] = "png";
    ImageFormat["SVG"] = "svg";
})(ImageFormat = exports.ImageFormat || (exports.ImageFormat = {}));
/**
 * Supported image output locations.
 */
var ImageLocation;
(function (ImageLocation) {
    ImageLocation[ImageLocation["Local"] = 1] = "Local";
    ImageLocation[ImageLocation["Remote"] = 2] = "Remote";
})(ImageLocation = exports.ImageLocation || (exports.ImageLocation = {}));
/**
 * Supported class diagram types when automatically generating class diagrams.
 */
var ClassDiagramType;
(function (ClassDiagramType) {
    ClassDiagramType[ClassDiagramType["None"] = 1] = "None";
    ClassDiagramType[ClassDiagramType["Simple"] = 2] = "Simple";
    ClassDiagramType[ClassDiagramType["Detailed"] = 3] = "Detailed";
})(ClassDiagramType = exports.ClassDiagramType || (exports.ClassDiagramType = {}));
/**
 * Supported class diagram positions when automatically generating class diagrams.
 */
var ClassDiagramPosition;
(function (ClassDiagramPosition) {
    ClassDiagramPosition[ClassDiagramPosition["Above"] = 1] = "Above";
    ClassDiagramPosition[ClassDiagramPosition["Below"] = 2] = "Below";
})(ClassDiagramPosition = exports.ClassDiagramPosition || (exports.ClassDiagramPosition = {}));
/**
 * Supported visibility styles for members when automatically generating class diagrams.
 */
var ClassDiagramMemberVisibilityStyle;
(function (ClassDiagramMemberVisibilityStyle) {
    ClassDiagramMemberVisibilityStyle[ClassDiagramMemberVisibilityStyle["Text"] = 1] = "Text";
    ClassDiagramMemberVisibilityStyle[ClassDiagramMemberVisibilityStyle["Icon"] = 2] = "Icon";
})(ClassDiagramMemberVisibilityStyle = exports.ClassDiagramMemberVisibilityStyle || (exports.ClassDiagramMemberVisibilityStyle = {}));
/**
 * Font styles supported by PlantUML.
 */
var FontStyle;
(function (FontStyle) {
    FontStyle["Undefined"] = "";
    FontStyle["Normal"] = "normal";
    FontStyle["Plain"] = "plain";
    FontStyle["Italic"] = "italic";
    FontStyle["Bold"] = "bold";
})(FontStyle = exports.FontStyle || (exports.FontStyle = {}));
/**
 * Class storing the options of the plugin.
 */
var PlantUmlPluginOptions = /** @class */ (function () {
    function PlantUmlPluginOptions() {
        /** The image format used for generating UML diagrams. */
        this.outputImageFormatOption = {
            type: typedoc_1.ParameterType.Map,
            name: "umlFormat",
            help: "png|svg",
            defaultValue: ImageFormat.PNG,
            map: new Map([
                ["png", ImageFormat.PNG],
                ["svg", ImageFormat.SVG],
            ]),
            value: ImageFormat.PNG,
        };
        /** The location where the generated UML diagrams should be stored. */
        this.outputImageLocationOption = {
            type: typedoc_1.ParameterType.Map,
            name: "umlLocation",
            help: "local|remote",
            defaultValue: ImageLocation.Local,
            map: new Map([
                ["local", ImageLocation.Local],
                ["remote", ImageLocation.Remote],
            ]),
            value: ImageLocation.Local,
        };
        /** Specifies whether UML class diagrams should be created automatically. */
        this.autoClassDiagramTypeOption = {
            type: typedoc_1.ParameterType.Map,
            name: "umlClassDiagramType",
            help: "none|simple|detailed",
            defaultValue: ClassDiagramType.None,
            map: new Map([
                ["none", ClassDiagramType.None],
                ["simple", ClassDiagramType.Simple],
                ["detailed", ClassDiagramType.Detailed],
            ]),
            value: ClassDiagramType.None,
        };
        /** Specifies where on the page the automatically created class diagram should be put. */
        this.autoClassDiagramPositionOption = {
            type: typedoc_1.ParameterType.Map,
            name: "umlClassDiagramPosition",
            help: "above|below",
            defaultValue: ClassDiagramPosition.Below,
            map: new Map([
                ["above", ClassDiagramPosition.Above],
                ["below", ClassDiagramPosition.Below],
            ]),
            value: ClassDiagramPosition.Below,
        };
        /** Specifies whether to hide empty properties and methods in the automatically created class diagram. */
        this.autoClassDiagramHideEmptyMembersOption = {
            type: typedoc_1.ParameterType.Boolean,
            name: "umlClassDiagramHideEmptyMembers",
            help: "true|false",
            defaultValue: true,
            value: true,
        };
        /** Specifies the boundary before swiching from top->down to left->right direction for class diagrams. */
        this.autoClassDiagramTopDownLayoutMaxSiblingsOption = {
            type: typedoc_1.ParameterType.Number,
            name: "umlClassDiagramTopDownLayoutMaxSiblings",
            help: "An integer indicating the max number of siblings to be used with the default top down layout.",
            defaultValue: 6,
            minValue: 0,
            value: 6,
        };
        /** Specifies whether UML class diagrams should be created automatically. */
        this.autoClassDiagramMemberVisibilityStyleOption = {
            type: typedoc_1.ParameterType.Map,
            name: "umlClassDiagramMemberVisibilityStyle",
            help: "text|icon",
            defaultValue: ClassDiagramMemberVisibilityStyle.Icon,
            map: new Map([
                ["text", ClassDiagramMemberVisibilityStyle.Text],
                ["icon", ClassDiagramMemberVisibilityStyle.Icon],
            ]),
            value: ClassDiagramMemberVisibilityStyle.Icon,
        };
        /**
         * Specifies whether to hide the circled character in front of class names
         * in the automatically created class diagram.
         */
        this.autoClassDiagramHideCircledCharOption = {
            type: typedoc_1.ParameterType.Boolean,
            name: "umlClassDiagramHideCircledChar",
            help: "true|false",
            defaultValue: false,
            value: false,
        };
        /** Specifies whether to hide the shadowing in the automatically created class diagrams */
        this.autoClassDiagramHideShadowOption = {
            type: typedoc_1.ParameterType.Boolean,
            name: "umlClassDiagramHideShadow",
            help: "true|false",
            defaultValue: false,
            value: false,
        };
        /** Specifies the background color used for boxes in automatically created class diagrams. */
        this.autoClassDiagramBoxBackgroundColorOption = {
            type: typedoc_1.ParameterType.String,
            name: "umlClassDiagramBoxBackgroundColor",
            help: "transparent|#RGBHEX",
            defaultValue: "",
            value: "",
        };
        /** Specifies the border color used for boxes in automatically created class diagrams. */
        this.autoClassDiagramBoxBorderColorOption = {
            type: typedoc_1.ParameterType.String,
            name: "umlClassDiagramBoxBorderColor",
            help: "transparent|#RGBHEX",
            defaultValue: "",
            value: "",
        };
        /** Specifies the border radius used for boxes in automatically created class diagrams. */
        this.autoClassDiagramBoxBorderRadiusOption = {
            type: typedoc_1.ParameterType.Number,
            name: "umlClassDiagramBoxBorderRadius",
            help: "The box border radius in pixel used when automatically creating class diagrams.",
            defaultValue: 0,
            minValue: 0,
            value: 0,
        };
        /** Specifies the border width used for boxes in automatically created class diagrams. */
        this.autoClassDiagramBoxBorderWidthOption = {
            type: typedoc_1.ParameterType.Number,
            name: "umlClassDiagramBoxBorderWidth",
            help: "The box border width in pixel used when automatically creating class diagrams.",
            defaultValue: -1,
            minValue: 0,
            value: -1,
        };
        /** Specifies the color used for arrows in automatically created class diagrams. */
        this.autoClassDiagramArrowColorOption = {
            type: typedoc_1.ParameterType.String,
            name: "umlClassDiagramArrowColor",
            help: "transparent|#RGBHEX",
            defaultValue: "",
            value: "",
        };
        /** Specifies the name of the font used for the class name in automatically created class diagrams. */
        this.autoClassDiagramClassFontNameOption = {
            type: typedoc_1.ParameterType.String,
            name: "umlClassDiagramClassFontName",
            help: "The name of the font used for the class name when automatically creating class diagrams.",
            defaultValue: "",
            value: "",
        };
        /** Specifies the font size for the class name in automatically created class diagrams. */
        this.autoClassDiagramClassFontSizeOption = {
            type: typedoc_1.ParameterType.Number,
            name: "umlClassDiagramClassFontSize",
            help: "The font size in pixel used for the class name when automatically creating class diagrams.",
            defaultValue: 0,
            minValue: 0,
            value: 0,
        };
        /** Specifies the font style for the class name in automatically created class diagrams. */
        this.autoClassDiagramClassFontStyleOption = {
            type: typedoc_1.ParameterType.Map,
            name: "umlClassDiagramClassFontStyle",
            help: "normal|plain|italic|bold",
            defaultValue: FontStyle.Undefined,
            map: new Map([
                ["normal", FontStyle.Normal],
                ["plain", FontStyle.Plain],
                ["italic", FontStyle.Italic],
                ["bold", FontStyle.Bold],
            ]),
            value: FontStyle.Undefined,
        };
        /** Specifies the font color for the class name in automatically created class diagrams. */
        this.autoClassDiagramClassFontColorOption = {
            type: typedoc_1.ParameterType.String,
            name: "umlClassDiagramClassFontColor",
            help: "transparent|#RGBHEX",
            defaultValue: "",
            value: "",
        };
        /** Specifies the name of the font used for the class attributes in automatically created class diagrams. */
        this.autoClassDiagramClassAttributeFontNameOption = {
            type: typedoc_1.ParameterType.String,
            name: "umlClassDiagramClassAttributeFontName",
            help: "The name of the font used for the class attributes when automatically creating class diagrams.",
            defaultValue: "",
            value: "",
        };
        /** Specifies the font size for the class attributes in automatically created class diagrams. */
        this.autoClassDiagramClassAttributeFontSizeOption = {
            type: typedoc_1.ParameterType.Number,
            name: "umlClassDiagramClassAttributeFontSize",
            help: "The font size in pixel used for the class attributes when automatically creating class diagrams.",
            defaultValue: 0,
            minValue: 0,
            value: 0,
        };
        /** Specifies the font style for the class attributes in automatically created class diagrams. */
        this.autoClassDiagramClassAttributeFontStyleOption = {
            type: typedoc_1.ParameterType.Map,
            name: "umlClassDiagramClassAttributeFontStyle",
            help: "normal|plain|italic|bold",
            defaultValue: FontStyle.Undefined,
            map: new Map([
                ["normal", FontStyle.Normal],
                ["plain", FontStyle.Plain],
                ["italic", FontStyle.Italic],
                ["bold", FontStyle.Bold],
            ]),
            value: FontStyle.Undefined,
        };
        /** Specifies the font color for the class attributes in automatically created class diagrams. */
        this.autoClassDiagramClassAttributeFontColorOption = {
            type: typedoc_1.ParameterType.String,
            name: "umlClassDiagramClassAttributeFontColor",
            help: "transparent|#RGBHEX",
            defaultValue: "",
            value: "",
        };
    }
    /**
     * Adds the command line options of the plugin to the TypeDoc application.
     * @param typedoc The TypeDoc application.
     */
    // prettier-ignore
    PlantUmlPluginOptions.prototype.addToApplication = function (typedoc) {
        typedoc.options.addDeclaration(this.outputImageFormatOption);
        typedoc.options.addDeclaration(this.outputImageLocationOption);
        typedoc.options.addDeclaration(this.autoClassDiagramTypeOption);
        typedoc.options.addDeclaration(this.autoClassDiagramPositionOption);
        typedoc.options.addDeclaration(this.autoClassDiagramHideEmptyMembersOption);
        typedoc.options.addDeclaration(this.autoClassDiagramTopDownLayoutMaxSiblingsOption);
        typedoc.options.addDeclaration(this.autoClassDiagramMemberVisibilityStyleOption);
        typedoc.options.addDeclaration(this.autoClassDiagramHideCircledCharOption);
        typedoc.options.addDeclaration(this.autoClassDiagramHideShadowOption);
        typedoc.options.addDeclaration(this.autoClassDiagramBoxBackgroundColorOption);
        typedoc.options.addDeclaration(this.autoClassDiagramBoxBorderColorOption);
        typedoc.options.addDeclaration(this.autoClassDiagramBoxBorderRadiusOption);
        typedoc.options.addDeclaration(this.autoClassDiagramBoxBorderWidthOption);
        typedoc.options.addDeclaration(this.autoClassDiagramArrowColorOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassFontNameOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassFontSizeOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassFontStyleOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassFontColorOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassAttributeFontNameOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassAttributeFontSizeOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassAttributeFontStyleOption);
        typedoc.options.addDeclaration(this.autoClassDiagramClassAttributeFontColorOption);
    };
    /**
     * Reads the values of the plugin options from the application options.
     * @param appOptions The TypeDoc application.
     */
    // prettier-ignore
    PlantUmlPluginOptions.prototype.readValuesFromApplication = function (typedoc) {
        this.outputImageFormatOption.value = typedoc.options.getValue(this.outputImageFormatOption.name);
        this.outputImageLocationOption.value = typedoc.options.getValue(this.outputImageLocationOption.name);
        this.autoClassDiagramTypeOption.value = typedoc.options.getValue(this.autoClassDiagramTypeOption.name);
        this.autoClassDiagramPositionOption.value = typedoc.options.getValue(this.autoClassDiagramPositionOption.name);
        this.autoClassDiagramHideEmptyMembersOption.value = typedoc.options.getValue(this.autoClassDiagramHideEmptyMembersOption.name);
        this.autoClassDiagramTopDownLayoutMaxSiblingsOption.value = typedoc.options.getValue(this.autoClassDiagramTopDownLayoutMaxSiblingsOption.name);
        this.autoClassDiagramMemberVisibilityStyleOption.value = typedoc.options.getValue(this.autoClassDiagramMemberVisibilityStyleOption.name);
        this.autoClassDiagramHideCircledCharOption.value = typedoc.options.getValue(this.autoClassDiagramHideCircledCharOption.name);
        this.autoClassDiagramHideShadowOption.value = typedoc.options.getValue(this.autoClassDiagramHideShadowOption.name);
        this.autoClassDiagramBoxBackgroundColorOption.value = typedoc.options.getValue(this.autoClassDiagramBoxBackgroundColorOption.name);
        this.autoClassDiagramBoxBorderColorOption.value = typedoc.options.getValue(this.autoClassDiagramBoxBorderColorOption.name);
        this.autoClassDiagramBoxBorderRadiusOption.value = typedoc.options.getValue(this.autoClassDiagramBoxBorderRadiusOption.name);
        this.autoClassDiagramBoxBorderWidthOption.value = typedoc.options.getValue(this.autoClassDiagramBoxBorderWidthOption.name);
        this.autoClassDiagramArrowColorOption.value = typedoc.options.getValue(this.autoClassDiagramArrowColorOption.name);
        this.autoClassDiagramClassFontNameOption.value = typedoc.options.getValue(this.autoClassDiagramClassFontNameOption.name);
        this.autoClassDiagramClassFontSizeOption.value = typedoc.options.getValue(this.autoClassDiagramClassFontSizeOption.name);
        this.autoClassDiagramClassFontStyleOption.value = typedoc.options.getValue(this.autoClassDiagramClassFontStyleOption.name);
        this.autoClassDiagramClassFontColorOption.value = typedoc.options.getValue(this.autoClassDiagramClassFontColorOption.name);
        this.autoClassDiagramClassAttributeFontNameOption.value = typedoc.options.getValue(this.autoClassDiagramClassAttributeFontNameOption.name);
        this.autoClassDiagramClassAttributeFontSizeOption.value = typedoc.options.getValue(this.autoClassDiagramClassAttributeFontSizeOption.name);
        this.autoClassDiagramClassAttributeFontStyleOption.value = typedoc.options.getValue(this.autoClassDiagramClassAttributeFontStyleOption.name);
        this.autoClassDiagramClassAttributeFontColorOption.value = typedoc.options.getValue(this.autoClassDiagramClassAttributeFontColorOption.name);
    };
    Object.defineProperty(PlantUmlPluginOptions.prototype, "outputImageFormat", {
        /**
         * Returns the image format used for generating UML diagrams.
         * @returns The image format used for generating UML diagrams.
         */
        get: function () {
            return this.outputImageFormatOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "outputImageLocation", {
        /**
         * Returns the location where the generated UML diagrams should be stored.
         * @returns The location where the generated UML diagrams should be stored.
         */
        get: function () {
            return this.outputImageLocationOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramType", {
        /**
         * Returns whether UML class diagrams should be created automatically.
         * @returns Whether UML class diagrams should be created automatically.
         */
        get: function () {
            return this.autoClassDiagramTypeOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramPosition", {
        /**
         * Returns where on the page the automatically created class diagram should be put.
         * @returns Where on the page the automatically created class diagram should be put.
         */
        get: function () {
            return this.autoClassDiagramPositionOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramHideEmptyMembers", {
        /**
         * Returns whether to hide empty properties and methods in the automatically created class diagram.
         * @returns Whether to hide empty properties and methods in the automatically created class diagram.
         */
        get: function () {
            return this.autoClassDiagramHideEmptyMembersOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramTopDownLayoutMaxSiblings", {
        /**
         * Returns the boundary before swiching from top->down to left->right direction for class diagrams.
         * @returns The boundary before swiching from top->down to left->right direction for class diagrams.
         */
        get: function () {
            return this.autoClassDiagramTopDownLayoutMaxSiblingsOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramMemberVisibilityStyle", {
        /**
         * Returns how the member visibility is rendered in the automatically created class diagram.
         * @returns How the member visibility is rendered in the automatically created class diagram.
         */
        get: function () {
            return this.autoClassDiagramMemberVisibilityStyleOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramHideCircledChar", {
        /**
         * Returns whether to hide the circled character in front of class names for class diagrams.
         * @returns Whether to hide the circled character in front of class names for class diagrams.
         */
        get: function () {
            return this.autoClassDiagramHideCircledCharOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramHideShadow", {
        /**
         * Returns whether to hide the shadows in the automatically created class diagram.
         * @returns Whether to hide the shadows in the automatically created class diagram.
         */
        get: function () {
            return this.autoClassDiagramHideShadowOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramBoxBackgroundColor", {
        /**
         * Returns the background color that should be used for boxes in automatically created class diagrams.
         * @returns The background color that should be used for boxes in automatically created class diagrams.
         *          An empty string if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramBoxBackgroundColorOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramBoxBorderColor", {
        /**
         * Returns the border color that should be used for boxes in automatically created class diagrams.
         * @returns The border color that should be used for boxes in automatically created class diagrams.
         *          An empty string if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramBoxBorderColorOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramBoxBorderRadius", {
        /**
         * Returns the border radius that should be used for boxes in automatically created class diagrams.
         * @returns The border radius that should be used for boxes in automatically created class diagrams.
         */
        get: function () {
            return this.autoClassDiagramBoxBorderRadiusOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramBoxBorderWidth", {
        /**
         * Returns the border width that should be used for boxes in automatically created class diagrams.
         * @returns The border width that should be used for boxes in automatically created class diagrams.
         *          The value -1 if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramBoxBorderWidthOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramArrowColor", {
        /**
         * Returns the color that should be used for arrows in automatically created class diagrams.
         * @returns The color that should be used for arrows in automatically created class diagrams.
         *          An empty string if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramArrowColorOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramClassFontName", {
        /**
         * Returns the name of the font that should be used for the class name in automatically created class diagrams.
         * @returns The name of the font that should be used for the class name in automatically created class diagrams.
         *          An empty string if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramClassFontNameOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramClassFontSize", {
        /**
         * Returns the font size that should be used for class names in automatically created class diagrams.
         * @returns The font size that should be used for class names in automatically created class diagrams.
         *          The value 0 if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramClassFontSizeOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramClassFontStyle", {
        /**
         * Returns the font style that should be used for the class name in automatically created class diagrams.
         * @returns The font style that should be used for the class name in automatically created class diagrams.
         */
        get: function () {
            return this.autoClassDiagramClassFontStyleOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramClassFontColor", {
        /**
         * Returns the font color that should be used for the class name in automatically created class diagrams.
         * @returns The font color that should be used for the class name in automatically created class diagrams.
         *          An empty string if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramClassFontColorOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramClassAttributeFontName", {
        /**
         * Returns the name of the font that should be used for class attributes in automatically created class diagrams.
         * @returns The name of the font that should be used for class attributes in automatically created class diagrams.
         *          An empty string if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramClassAttributeFontNameOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramClassAttributeFontSize", {
        /**
         * Returns the font size that should be used for class attributes in automatically created class diagrams.
         * @returns The font size that should be used for class attributes in automatically created class diagrams.
         *          The value 0 if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramClassAttributeFontSizeOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramClassAttributeFontStyle", {
        /**
         * Returns the font style that should be used for the class attributes in automatically created class diagrams.
         * @returns The font style that should be used for the class attributes in automatically created class diagrams.
         */
        get: function () {
            return this.autoClassDiagramClassAttributeFontStyleOption.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlantUmlPluginOptions.prototype, "autoClassDiagramClassAttributeFontColor", {
        /**
         * Returns the font color that should be used for the class attributes in automatically created class diagrams.
         * @returns The font color that should be used for the class attributes in automatically created class diagrams.
         *          An empty string if no value was specified by the caller.
         *          In this case the PlantUML default value should be used.
         */
        get: function () {
            return this.autoClassDiagramClassAttributeFontColorOption.value;
        },
        enumerable: true,
        configurable: true
    });
    return PlantUmlPluginOptions;
}());
exports.PlantUmlPluginOptions = PlantUmlPluginOptions;
//# sourceMappingURL=plantuml_plugin_options.js.map