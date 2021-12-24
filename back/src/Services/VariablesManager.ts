/**
 * Handles variables shared between the scripting API and the server.
 */
import { ITiledMap, ITiledMapLayer, ITiledMapObject } from "@workadventure/tiled-map-type-guard/dist";
import { User } from "_Model/User";
import { variablesRepository } from "./Repository/VariablesRepository";
import { redisClient } from "./RedisClient";
import { VariableError } from "./VariableError";

interface Variable {
    defaultValue?: string;
    persist?: boolean;
    readableBy?: string;
    writableBy?: string;
}

export class VariablesManager {
    /**
     * The actual values of the variables for the current room
     */
    private _variables = new Map<string, string>();

    /**
     * The list of variables that are allowed
     */
    private variableObjects: Map<string, Variable> | undefined;

    /**
     * @param map The map can be "null" if it is hosted on a private network. In this case, we assume this is a test setup and bypass any server-side checks.
     */
    constructor(private roomUrl: string, private map: ITiledMap | null) {
        // We initialize the list of variable object at room start. The objects cannot be edited later
        // (otherwise, this would cause a security issue if the scripting API can edit this list of objects)
        if (map) {
            this.variableObjects = VariablesManager.findVariablesInMap(map);

            // Let's initialize default values
            for (const [name, variableObject] of this.variableObjects.entries()) {
                if (variableObject.defaultValue !== undefined) {
                    this._variables.set(name, variableObject.defaultValue);
                }
            }
        }
    }

    /**
     * Let's load data from the Redis backend.
     */
    public async init(): Promise<VariablesManager> {
        if (!this.shouldPersist()) {
            return this;
        }
        const variables = await variablesRepository.loadVariables(this.roomUrl);
        for (const key in variables) {
            // Let's only set variables if they are in the map (if the map has changed, maybe stored variables do not exist anymore)
            if (this.variableObjects) {
                const variableObject = this.variableObjects.get(key);
                if (variableObject === undefined) {
                    continue;
                }
                if (!variableObject.persist) {
                    continue;
                }
            }

            this._variables.set(key, variables[key]);
        }
        return this;
    }

    /**
     * Returns true if saving should be enabled, and false otherwise.
     *
     * Saving is enabled if REDIS_HOST is set
     *   unless we are editing a local map
     *     unless we are in dev mode in which case it is ok to save
     *
     * @private
     */
    private shouldPersist(): boolean {
        return redisClient !== null && (this.map !== null || process.env.NODE_ENV === "development");
    }

    private static findVariablesInMap(map: ITiledMap): Map<string, Variable> {
        const objects = new Map<string, Variable>();
        for (const layer of map.layers) {
            this.recursiveFindVariablesInLayer(layer, objects);
        }
        return objects;
    }

    private static recursiveFindVariablesInLayer(layer: ITiledMapLayer, objects: Map<string, Variable>): void {
        if (layer.type === "objectgroup") {
            for (const object of layer.objects) {
                if (object.type === "variable") {
                    if (object.template) {
                        console.warn(
                            'Warning, a variable object is using a Tiled "template". WorkAdventure does not support objects generated from Tiled templates.'
                        );
                        continue;
                    }

                    // We store a copy of the object (to make it immutable)
                    objects.set(object.name as string, this.iTiledObjectToVariable(object));
                }
            }
        } else if (layer.type === "group") {
            for (const innerLayer of layer.layers as ITiledMapLayer[]) {
                this.recursiveFindVariablesInLayer(innerLayer, objects);
            }
        }
    }

    private static iTiledObjectToVariable(object: ITiledMapObject): Variable {
        const variable: Variable = {};

        if (object.properties) {
            for (const property of object.properties) {
                const value = property.value as unknown;
                switch (property.name) {
                    case "default":
                        variable.defaultValue = JSON.stringify(value);
                        break;
                    case "persist":
                        if (typeof value !== "boolean") {
                            throw new Error('The persist property of variable "' + object.name + '" must be a boolean');
                        }
                        variable.persist = value;
                        break;
                    case "writableBy":
                        if (typeof value !== "string") {
                            throw new Error(
                                'The writableBy property of variable "' + object.name + '" must be a string'
                            );
                        }
                        if (value) {
                            variable.writableBy = value;
                        }
                        break;
                    case "readableBy":
                        if (typeof value !== "string") {
                            throw new Error(
                                'The readableBy property of variable "' + object.name + '" must be a string'
                            );
                        }
                        if (value) {
                            variable.readableBy = value;
                        }
                        break;
                }
            }
        }

        return variable;
    }

    /**
     * Sets the variable.
     *
     * Returns who is allowed to read the variable (the readableby property) or "undefined" if anyone can read it.
     * Also, returns "false" if the variable was not modified (because we set it to the value it already has)
     *
     * @param name
     * @param value
     * @param user
     */
    setVariable(name: string, value: string, user: User): string | undefined | false {
        let readableBy: string | undefined;
        let variableObject: Variable | undefined;
        if (this.variableObjects) {
            variableObject = this.variableObjects.get(name);
            if (variableObject === undefined) {
                throw new VariableError(
                    'Trying to set a variable "' + name + '" that is not defined as an object in the map.'
                );
            }

            if (variableObject.writableBy && !user.tags.includes(variableObject.writableBy)) {
                throw new VariableError(
                    'Trying to set a variable "' +
                        name +
                        '". User "' +
                        user.name +
                        '" does not have sufficient permission. Required tag: "' +
                        variableObject.writableBy +
                        '". User tags: ' +
                        user.tags.join(", ") +
                        "."
                );
            }

            readableBy = variableObject.readableBy;
        }

        // If the value is not modified, return false
        if (this._variables.get(name) === value) {
            return false;
        }

        this._variables.set(name, value);

        if (variableObject !== undefined && variableObject.persist) {
            variablesRepository
                .saveVariable(this.roomUrl, name, value)
                .catch((e) => console.error("Error while saving variable in Redis:", e));
        }

        return readableBy;
    }

    public getVariablesForTags(tags: string[]): Map<string, string> {
        if (this.variableObjects === undefined) {
            return this._variables;
        }

        const readableVariables = new Map<string, string>();

        for (const [key, value] of this._variables.entries()) {
            const variableObject = this.variableObjects.get(key);
            if (variableObject === undefined) {
                throw new Error('Unexpected variable "' + key + '" found has no associated variableObject.');
            }
            if (!variableObject.readableBy || tags.includes(variableObject.readableBy)) {
                readableVariables.set(key, value);
            }
        }
        return readableVariables;
    }
}
