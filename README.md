# typedoc-plantuml
**Plugin for TypeDoc that generates images for PlantUML diagrams embedded in comments.**

### Installation

The plugin can then be installed using [npm](https://www.npmjs.com/):
 
```sh
$ npm install typedoc-plantuml --save-dev
```

### Usage

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
export class SomeClass {

}
```

You can view the generated documentation [here](https://rawgit.com/artifacthealth/typedoc-plantuml/master/tests/baselines/reference/basic/classes/someclass.html).

Please refer to the [plantuml website](http://plantuml.com/) for a full reference on the supported UML syntax.

### Options

The following options are added to TypeDoc when the plugin is installed:

* `--umlLocation <local|remote>`<br> 
  Specifies the location of the generated uml images. If `local` then local image files are created in the assets 
  directory of the generated documentation. If `remote` then the image tag uses an encoded link to the
  [plantuml server](http://www.plantuml.com/plantuml/). Default is `local`.
* `--umlFormat <png|svg>`<br>
  Specifies the image format to use. Default is PNG.
* `--umlClassDiagramPosition <above|below>`<br>
  Automatically creates a class diagram for every class and interface that has a comment. The class diagram is inserted
  `above` or `below` the comment's text. It includes one level of base and sub classes.
* `--umlClassDiagramHideEmptyMembers <true|false>`<br>
  When automatically generating class diagrams if this option is set to true attributes and methods are hidden if they
  are empty. Default is false.
* `--umlClassDiagramTopDownLayoutMaxSiblings <integer>`<br>
  When automatically generating class diagrams use this option to specify the maximal number of allowed siblings above
  (extended types and implemented interfaces) and below (extending types and implementing interfaces) the current type.
  If this number is exceeded the PlantUML layout is switched from top/down to left/right to allow a better readability
  of the resulting class diagram. Default value is `8`.

### License

Licensed under the Apache License 2.0.  
