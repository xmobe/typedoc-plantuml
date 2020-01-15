# typedoc-plantuml

**Plugin for TypeDoc that generates images for PlantUML diagrams embedded in comments.**

## Installation

The plugin can then be installed using [npm](https://www.npmjs.com/):

```sh
$ npm install typedoc-plantuml --save-dev
```

## Usage

TypeDoc automatically detects plugins installed via npm. After installation TypeDoc can be used normally and UML
diagrams in comments will be processed.

The start of a UML diagram is indicated by the `<uml>` tag and closed by the `</uml>` tag. Alternate text for the
generated image can optionally be specified using the `alt` attribute. For example `<uml alt="Some diagram">`.

Note that the parser that finds the xml tags in the comment text is not very smart, so avoid unnecessary whitespace or
other attributes to the tag.

The following is an example of embedding a sequence diagram in a class description.

```typescript
/**
 * Some class in a project.
 *
 * <uml>
 *     Bob->Alice : hello
 * </uml>
 */
export class SomeClass {}
```

You can view the generated documentation [here](https://rawgit.com/artifacthealth/typedoc-plantuml/master/tests/baselines/reference/basic/classes/someclass.html).

Please refer to the [plantuml website](http://plantuml.com/) for a full reference on the supported UML syntax.

## Options

The following options are added to TypeDoc when the plugin is installed:

-   `--umlLocation <local|remote>`<br>
    Specifies the location of the generated uml images. If `local` then local image files are created in the assets
    directory of the generated documentation. If `remote` then the image tag uses an encoded link to the
    [plantuml server](http://www.plantuml.com/plantuml/). Default is `local`.
-   `--umlFormat <png|svg>`<br>
    Specifies the image format to use. Default is `png`.

## Automatic class diagram generation

The plugin has the feature to automatically add a class diagram for every class and interface that has a comment.
Use the first of the following options to enable this feature and the other options to control its output:

-   `--umlClassDiagramType <none|simple|detailed>`<br>
    Use this option to automatically create a class diagram for every class and interface that has a comment.
    The class diagram includes one level of base and sub classes. Use the value `simple` to only render the name
    of the class or interface. Use the value `detailed` to also render properties and methods.
    Default is `none` meaning that this feature is disabled by default.
-   `--umlClassDiagramPosition <above|below>`<br>
    Use this option to specify where the class diagram should be placed.
    The class diagram can be inserted `above` or `below` the comment's text. Default is `below`.
-   `--umlClassDiagramHideEmptyMembers <true|false>`<br>
    If this option is set to true properties and methods are hidden if they are empty. Default is `true`.
-   `--umlClassDiagramTopDownLayoutMaxSiblings <integer>`<br>
    Use this option to specify the maximum number of allowed siblings above (extended types and implemented interfaces)
    and below (extending types and implementing interfaces) the current type. If this number is exceeded the PlantUML
    layout is switched from top/down to left/right to allow a better readability of the resulting class diagram.
    Default value is `6`.
-   `--umlClassDiagramMemberVisibilityStyle <text|icon>`<br>
    Use this option to specify how the visibility (private, protected or public) of class members
    (properties and methods) should be rendered in the class diagrams. Default is `icon`.
-   `--umlClassDiagramHideCircledChar <true|false>`<br>
    If this option is set to true the circled char in front of class and interface names is omitted. Default is `false`.
-   `--umlClassDiagramHideShadow <true|false>`<br>
    If this option is set to true the shadowing in the class diagrams is disabled. Default is `false`.
-   `--umlClassDiagramBoxBackgroundColor <transparent|#RGBHEX>`<br>
    Use this option to specify the background color of the boxes within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramBoxBorderColor <transparent|#RGBHEX>`<br>
    Use this option to specify the border color of the boxes within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramBoxBorderRadius <integer>`<br>
    Use this option to specify the border radius of the boxes within the class diagram.
    Unit is pixel. Default value is `0`.
-   `--umlClassDiagramBoxBorderWidth <integer>`<br>
    Use this option to specify the border width of the boxes within the class diagram.
    Unit is pixel. Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramArrowColor <transparent|#RGBHEX>`<br>
    Use this option to specify the color of the arrows within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassFontName <font-name>`<br>
    Use this option to specify the name of the font used for the class names within the class diagram.
    **The PlantUML site remarks:** _Please note the fontname is highly system dependent, so do not over use it,
    if you look for portability. Helvetica and Courier should be available on all system._
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassFontSize <integer>`<br>
    Use this option to specify the font size of the class names within the class diagram.
    Unit is pixel. Default value is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassFontStyle <normal|plain|italic|bold>`<br>
    Use this option to specify the style of the font used for the class names within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassFontColor <transparent|#RGBHEX>`<br>
    Use this option to specify the color of the class names within the class diagram.
    Default is the PlantUML default value for this skin parameter.
-   `--umlClassDiagramClassAttributeFontName <font-name>`<br>
    Use this option to specify the name of the font used for class attributes within the class diagram.
    **The PlantUML site remarks:** _Please note the fontname is highly system dependent, so do not over use it,
    if you look for portability. Helvetica and Courier should be available on all system._
    Default is the PlantUML default value for this skin parameter.

## License

Licensed under the Apache License 2.0.
