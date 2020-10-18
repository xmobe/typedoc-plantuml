"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("typedoc/dist/lib/models/index");
/**
 * Class with utility functions regarding TypeDoc reflections.
 */
var TypeDocUtils = /** @class */ (function () {
    function TypeDocUtils() {
    }
    /**
     * Returns the reflections the given reflection is extending.
     * @param reflection The reflection whoes extended types are wanted.
     * @returns The reflections the given reflection is extending.
     */
    TypeDocUtils.getExtendedTypesForReflection = function (reflection) {
        var extendedTypes = new Array();
        if (reflection.extendedTypes) {
            for (var _i = 0, _a = reflection.extendedTypes; _i < _a.length; _i++) {
                var extendedType = _a[_i];
                if (extendedType instanceof index_1.ReferenceType && extendedType.reflection instanceof index_1.DeclarationReflection) {
                    extendedTypes.push(extendedType.reflection);
                }
            }
        }
        return extendedTypes;
    };
    /**
     * Returns the reflections that are extending the given reflection.
     * @param reflection The reflection whoes sub types are wanted.
     * @returns The reflections that are extending the given reflection.
     */
    TypeDocUtils.getExtendedBysForReflection = function (reflection) {
        var extendedBys = new Array();
        if (reflection.extendedBy) {
            for (var _i = 0, _a = reflection.extendedBy; _i < _a.length; _i++) {
                var extendedByType = _a[_i];
                if (extendedByType instanceof index_1.ReferenceType &&
                    extendedByType.reflection instanceof index_1.DeclarationReflection) {
                    extendedBys.push(extendedByType.reflection);
                }
            }
        }
        return extendedBys;
    };
    /**
     * Returns the reflections the given reflection is implementing.
     * @param reflection The reflection whoes implemented types are wanted.
     * @returns The reflections the given reflection is implementing.
     */
    TypeDocUtils.getImplementedTypesForReflection = function (reflection) {
        var implementedTypes = new Array();
        if (reflection.implementedTypes) {
            // build a list of all implemented types of the reflection
            // note: this list also includes all implemented types that base classes are implementing
            for (var _i = 0, _a = reflection.implementedTypes; _i < _a.length; _i++) {
                var implementedType = _a[_i];
                if (implementedType instanceof index_1.ReferenceType &&
                    implementedType.reflection instanceof index_1.DeclarationReflection) {
                    implementedTypes.push(implementedType.reflection);
                }
            }
            if (reflection.extendedTypes) {
                var extendedTypeParents = new Array();
                // build a list of all parent types of the extended types
                for (var _b = 0, _c = reflection.extendedTypes; _b < _c.length; _b++) {
                    var extendedType = _c[_b];
                    if (extendedType instanceof index_1.ReferenceType &&
                        extendedType.reflection instanceof index_1.DeclarationReflection) {
                        extendedTypeParents = extendedTypeParents.concat(TypeDocUtils.getParentTypesForReflection(extendedType.reflection));
                    }
                }
                // remove all implemented types that are implemented by base classes
                for (var _d = 0, extendedTypeParents_1 = extendedTypeParents; _d < extendedTypeParents_1.length; _d++) {
                    var extendedTypeParent = extendedTypeParents_1[_d];
                    for (var j = 0; j < implementedTypes.length; ++j) {
                        if (implementedTypes[j].name === extendedTypeParent.name) {
                            implementedTypes.splice(j, 1);
                            --j;
                        }
                    }
                }
            }
        }
        return implementedTypes;
    };
    /**
     * Returns the reflections that are implementing the given reflection.
     * @param reflection The reflection whoes implementations are wanted.
     * @returns The reflections that are implementing the given reflection.
     */
    TypeDocUtils.getImplementedBysForReflection = function (reflection) {
        var implementedBys = new Array();
        if (reflection.implementedBy) {
            // build a list of all implementations of the reflection
            // note: this list also includes sub classes
            for (var _i = 0, _a = reflection.implementedBy; _i < _a.length; _i++) {
                var implementedByType = _a[_i];
                if (implementedByType instanceof index_1.ReferenceType &&
                    implementedByType.reflection instanceof index_1.DeclarationReflection) {
                    implementedBys.push(implementedByType.reflection);
                }
            }
            // build a list of all sub types of the implementations
            var implementedBySubTypes = new Array();
            for (var _b = 0, implementedBys_1 = implementedBys; _b < implementedBys_1.length; _b++) {
                var implementedBy = implementedBys_1[_b];
                implementedBySubTypes = implementedBySubTypes.concat(TypeDocUtils.getSubTypesForReflection(implementedBy));
            }
            // remove all implementations that are sub classes of implementations
            for (var _c = 0, implementedBySubTypes_1 = implementedBySubTypes; _c < implementedBySubTypes_1.length; _c++) {
                var implementedBySubType = implementedBySubTypes_1[_c];
                for (var j = 0; j < implementedBys.length; ++j) {
                    if (implementedBys[j].name === implementedBySubType.name) {
                        implementedBys.splice(j, 1);
                        --j;
                    }
                }
            }
        }
        return implementedBys;
    };
    /**
     * Returns all (recursive) reflections the given reflection is extending or implementing.
     * @param reflection The reflection whoes parent types are wanted.
     * @returns The reflections the given reflection is extending or implementing.
     */
    TypeDocUtils.getParentTypesForReflection = function (reflection) {
        var parentTypes = new Array();
        // add all extended types of the reflection
        if (reflection.extendedTypes) {
            for (var _i = 0, _a = reflection.extendedTypes; _i < _a.length; _i++) {
                var extendedType = _a[_i];
                if (extendedType instanceof index_1.ReferenceType && extendedType.reflection instanceof index_1.DeclarationReflection) {
                    parentTypes.push(extendedType.reflection);
                    parentTypes = parentTypes.concat(TypeDocUtils.getParentTypesForReflection(extendedType.reflection));
                }
            }
        }
        // add all implemented types of the reflection
        if (reflection.implementedTypes) {
            for (var _b = 0, _c = reflection.implementedTypes; _b < _c.length; _b++) {
                var implementedType = _c[_b];
                if (implementedType instanceof index_1.ReferenceType &&
                    implementedType.reflection instanceof index_1.DeclarationReflection) {
                    parentTypes.push(implementedType.reflection);
                    parentTypes = parentTypes.concat(TypeDocUtils.getParentTypesForReflection(implementedType.reflection));
                }
            }
        }
        return TypeDocUtils.removeDuplicatesFromReflectionArray(parentTypes);
    };
    /**
     * Returns all (recursive) reflections the given reflection is extended by or implemented by.
     * @param reflection The reflection whoes sub types are wanted.
     * @returns The reflections the given reflection is extended by or implemented by.
     */
    TypeDocUtils.getSubTypesForReflection = function (reflection) {
        var subTypes = new Array();
        // add all extensions of the reflection
        if (reflection.extendedBy) {
            for (var _i = 0, _a = reflection.extendedBy; _i < _a.length; _i++) {
                var extendedByType = _a[_i];
                if (extendedByType instanceof index_1.ReferenceType &&
                    extendedByType.reflection instanceof index_1.DeclarationReflection) {
                    subTypes.push(extendedByType.reflection);
                    subTypes = subTypes.concat(TypeDocUtils.getSubTypesForReflection(extendedByType.reflection));
                }
            }
        }
        // add all implementations of the reflection
        if (reflection.implementedBy) {
            for (var _b = 0, _c = reflection.implementedBy; _b < _c.length; _b++) {
                var implementedByType = _c[_b];
                if (implementedByType instanceof index_1.ReferenceType &&
                    implementedByType.reflection instanceof index_1.DeclarationReflection) {
                    subTypes.push(implementedByType.reflection);
                    subTypes = subTypes.concat(TypeDocUtils.getSubTypesForReflection(implementedByType.reflection));
                }
            }
        }
        return TypeDocUtils.removeDuplicatesFromReflectionArray(subTypes);
    };
    /**
     * Removes duplicates from an array of reflections.
     * @param reflections The array from which duplicates should be removed.
     * @returns The new array without duplicates.
     */
    TypeDocUtils.removeDuplicatesFromReflectionArray = function (reflections) {
        if (reflections.length === 0) {
            return [];
        }
        var newArray = new Array(); // this array is returned
        // We use a map and the reflection's name as the key to remove duplicates.
        var mapObj = new Map();
        for (var _i = 0, reflections_1 = reflections; _i < reflections_1.length; _i++) {
            var ref = reflections_1[_i];
            if (ref) {
                mapObj.set(ref.name, ref);
            }
        }
        for (var _a = 0, _b = Array.from(mapObj.keys()); _a < _b.length; _a++) {
            var name = _b[_a];
            newArray.push(mapObj.get(name));
        }
        return newArray;
    };
    return TypeDocUtils;
}());
exports.TypeDocUtils = TypeDocUtils;
//# sourceMappingURL=typedoc_utils.js.map