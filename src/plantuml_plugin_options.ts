import { Application } from "typedoc";
import { PluginBooleanOption } from "typedoc-plugin-base/dist/plugin_boolean_option";
import { PluginEnumOption } from "typedoc-plugin-base/dist/plugin_enum_option";
import { PluginNumberOption } from "typedoc-plugin-base/dist/plugin_number_option";
import { PluginStringOption } from "typedoc-plugin-base/dist/plugin_string_option";

/**
 * Supported image output formats.
 */
export enum ImageFormat {
    PNG = "png",
    SVG = "svg",
}

/**
 * Supported image output locations.
 */
export enum ImageLocation {
    Local = 1,
    Remote = 2,
}

/**
 * Supported class diagram types when automatically generating class diagrams.
 */
export enum ClassDiagramType {
    None = 1,
    Simple = 2,
    Detailed = 3,
}

/**
 * Supported class diagram positions when automatically generating class diagrams.
 */
export enum ClassDiagramPosition {
    Above = 1,
    Below = 2,
}

/**
 * Supported visibility styles for members when automatically generating class diagrams.
 */
export enum ClassDiagramMemberVisibilityStyle {
    Text = 1,
    Icon = 2,
}

/**
 * Class storing the options of the plugin.
 */
export class PlantUmlPluginOptions {
    /** The image format used for generating UML diagrams. */
    protected outputImageFormatOption: PluginEnumOption<ImageFormat>;

    /** The location where the generated UML diagrams should be stored. */
    protected outputImageLocationOption: PluginEnumOption<ImageLocation>;

    /** Specifies whether UML class diagrams should be created automatically. */
    protected autoClassDiagramTypeOption: PluginEnumOption<ClassDiagramType>;

    /** Specifies where on the page the automatically created class diagram should be put. */
    protected autoClassDiagramPositionOption: PluginEnumOption<ClassDiagramPosition>;

    /** Specifies whether to hide empty properties and methods in the automatically created class diagram. */
    protected autoClassDiagramHideEmptyMembersOption: PluginBooleanOption;

    /** Specifies the boundary before swiching from top->down to left->right direction for class diagrams. */
    protected autoClassDiagramTopDownLayoutMaxSiblingsOption: PluginNumberOption;

    /** Specifies whether UML class diagrams should be created automatically. */
    protected autoClassDiagramMemberVisibilityStyleOption: PluginEnumOption<ClassDiagramMemberVisibilityStyle>;

    /**
     * Specifies whether to hide the circled character in front of class names
     * in the automatically created class diagram.
     */
    protected autoClassDiagramHideCircledCharOption: PluginBooleanOption;

    /** Specifies whether to hide the shadowing in the automatically created class diagrams */
    protected autoClassDiagramHideShadowOption: PluginBooleanOption;

    /** Specifies the background color used for boxes in automatically created class diagrams. */
    protected autoClassDiagramBoxBackgroundColorOption: PluginStringOption;

    /**
     * Intializes a new plugin options instance.
     */
    constructor() {
        this.outputImageFormatOption = new PluginEnumOption<ImageFormat>(
            "umlFormat",
            "png|svg",
            ImageFormat.PNG,
            new Map([
                ["png", ImageFormat.PNG],
                ["svg", ImageFormat.SVG],
            ])
        );

        this.outputImageLocationOption = new PluginEnumOption<ImageLocation>(
            "umlLocation",
            "local|remote",
            ImageLocation.Local,
            new Map([
                ["local", ImageLocation.Local],
                ["remote", ImageLocation.Remote],
            ])
        );

        this.autoClassDiagramTypeOption = new PluginEnumOption<ClassDiagramType>(
            "umlClassDiagramType",
            "none|simple|detailed",
            ClassDiagramType.None,
            new Map([
                ["none", ClassDiagramType.None],
                ["simple", ClassDiagramType.Simple],
                ["detailed", ClassDiagramType.Detailed],
            ])
        );

        this.autoClassDiagramPositionOption = new PluginEnumOption<ClassDiagramPosition>(
            "umlClassDiagramPosition",
            "above|below",
            ClassDiagramPosition.Below,
            new Map([
                ["above", ClassDiagramPosition.Above],
                ["below", ClassDiagramPosition.Below],
            ])
        );

        this.autoClassDiagramHideEmptyMembersOption = new PluginBooleanOption(
            "umlClassDiagramHideEmptyMembers",
            "true|false",
            true
        );

        this.autoClassDiagramTopDownLayoutMaxSiblingsOption = new PluginNumberOption(
            "umlClassDiagramTopDownLayoutMaxSiblings",
            "An integer indicating the max number of siblings to be used with the default top down layout.",
            6,
            0,
            Infinity
        );

        this.autoClassDiagramMemberVisibilityStyleOption = new PluginEnumOption<ClassDiagramMemberVisibilityStyle>(
            "umlClassDiagramMemberVisibilityStyle",
            "text|icon",
            ClassDiagramMemberVisibilityStyle.Icon,
            new Map([
                ["text", ClassDiagramMemberVisibilityStyle.Text],
                ["icon", ClassDiagramMemberVisibilityStyle.Icon],
            ])
        );

        this.autoClassDiagramHideCircledCharOption = new PluginBooleanOption(
            "umlClassDiagramHideCircledChar",
            "true|false",
            false
        );

        this.autoClassDiagramHideShadowOption = new PluginBooleanOption(
            "umlClassDiagramHideShadow",
            "true|false",
            false
        );

        this.autoClassDiagramBoxBackgroundColorOption = new PluginStringOption(
            "umlClassDiagramBoxBackgroundColor",
            "transparent|#RGBHEX",
            ""
        );
    }

    /**
     * Adds the command line options of the plugin to the TypeDoc application.
     * @param typedoc The TypeDoc application.
     */
    public addToApplication(typedoc: Application): void {
        this.outputImageFormatOption.addToApplication(typedoc);
        this.outputImageLocationOption.addToApplication(typedoc);
        this.autoClassDiagramTypeOption.addToApplication(typedoc);
        this.autoClassDiagramPositionOption.addToApplication(typedoc);
        this.autoClassDiagramHideEmptyMembersOption.addToApplication(typedoc);
        this.autoClassDiagramTopDownLayoutMaxSiblingsOption.addToApplication(typedoc);
        this.autoClassDiagramMemberVisibilityStyleOption.addToApplication(typedoc);
        this.autoClassDiagramHideCircledCharOption.addToApplication(typedoc);
        this.autoClassDiagramHideShadowOption.addToApplication(typedoc);
        this.autoClassDiagramBoxBackgroundColorOption.addToApplication(typedoc);
    }

    /**
     * Reads the values of the plugin options from the application options.
     * @param appOptions The TypeDoc application.
     */
    public readValuesFromApplication(typedoc: Application): void {
        this.outputImageFormatOption.readValueFromApplication(typedoc);
        this.outputImageLocationOption.readValueFromApplication(typedoc);
        this.autoClassDiagramTypeOption.readValueFromApplication(typedoc);
        this.autoClassDiagramPositionOption.readValueFromApplication(typedoc);
        this.autoClassDiagramHideEmptyMembersOption.readValueFromApplication(typedoc);
        this.autoClassDiagramTopDownLayoutMaxSiblingsOption.readValueFromApplication(typedoc);
        this.autoClassDiagramMemberVisibilityStyleOption.readValueFromApplication(typedoc);
        this.autoClassDiagramHideCircledCharOption.readValueFromApplication(typedoc);
        this.autoClassDiagramHideShadowOption.readValueFromApplication(typedoc);
        this.autoClassDiagramBoxBackgroundColorOption.readValueFromApplication(typedoc);
    }

    /**
     * Returns the image format used for generating UML diagrams.
     * @returns The image format used for generating UML diagrams.
     */
    get outputImageFormat(): ImageFormat {
        return this.outputImageFormatOption.val;
    }

    /**
     * Returns the location where the generated UML diagrams should be stored.
     * @returns The location where the generated UML diagrams should be stored.
     */
    get outputImageLocation(): ImageLocation {
        return this.outputImageLocationOption.val;
    }

    /**
     * Returns whether UML class diagrams should be created automatically.
     * @returns Whether UML class diagrams should be created automatically.
     */
    get autoClassDiagramType(): ClassDiagramType {
        return this.autoClassDiagramTypeOption.val;
    }

    /**
     * Returns where on the page the automatically created class diagram should be put.
     * @returns Where on the page the automatically created class diagram should be put.
     */
    get autoClassDiagramPosition(): ClassDiagramPosition {
        return this.autoClassDiagramPositionOption.val;
    }

    /**
     * Returns whether to hide empty properties and methods in the automatically created class diagram.
     * @returns Whether to hide empty properties and methods in the automatically created class diagram.
     */
    get autoClassDiagramHideEmptyMembers(): boolean {
        return this.autoClassDiagramHideEmptyMembersOption.val;
    }

    /**
     * Returns the boundary before swiching from top->down to left->right direction for class diagrams.
     * @returns The boundary before swiching from top->down to left->right direction for class diagrams.
     */
    get autoClassDiagramTopDownLayoutMaxSiblings(): number {
        return this.autoClassDiagramTopDownLayoutMaxSiblingsOption.val;
    }

    /**
     * Returns how the member visibility is rendered in the automatically created class diagram.
     * @returns How the member visibility is rendered in the automatically created class diagram.
     */
    get autoClassDiagramMemberVisibilityStyle(): ClassDiagramMemberVisibilityStyle {
        return this.autoClassDiagramMemberVisibilityStyleOption.val;
    }

    /**
     * Returns whether to hide the circled character in front of class names for class diagrams.
     * @returns Whether to hide the circled character in front of class names for class diagrams.
     */
    get autoClassDiagramHideCircledChar(): boolean {
        return this.autoClassDiagramHideCircledCharOption.val;
    }

    /**
     * Returns whether to hide the shadows in the automatically created class diagram.
     * @returns Whether to hide the shadows in the automatically created class diagram.
     */
    get autoClassDiagramHideShadow(): boolean {
        return this.autoClassDiagramHideShadowOption.val;
    }

    /**
     * Returns the background color that should be used for boxes in automatically created class diagrams.
     * @returns The background color that should be used for boxes in automatically created class diagrams.
     *          An empty string if no value was specified by the caller.
     *          In this case the PlantUML default value should be used.
     */
    get autoClassDiagramBoxBackgroundColor(): string {
        return this.autoClassDiagramBoxBackgroundColorOption.val;
    }
}
