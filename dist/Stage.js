"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Group_1 = require("./Group");
const Layer_1 = require("./Layer");
/**
 * Container for layers
 *
 */
class Stage extends Layer_1.Layer {
    constructor() {
        super();
        this.isStage = true;
        this._tempGroups = [];
        /**
         * Found layers
         */
        this._activeLayers = [];
        this._activeParentStage = null;
    }
    /**
     * clears all display lists that were used in last rendering session
     * please clear it when you stop using this displayList, otherwise you may have problems with GC in some cases
     */
    clear() {
        this._activeLayers.length = 0;
        this._tempGroups.length = 0;
    }
    destroy(options) {
        this.clear();
        super.destroy(options);
    }
    /**
     *
     * @param displayObject {PIXI.DisplayObject} container that we are adding to Stage
     * @private
     */
    _addRecursive(displayObject) {
        if (!displayObject.visible) {
            return;
        }
        if (displayObject.isLayer) {
            const layer = displayObject;
            this._activeLayers.push(layer);
            layer.beginWork(this);
        }
        if (displayObject != this && displayObject.isStage) {
            const stage = displayObject;
            stage.updateAsChildStage(this);
            return;
        }
        // sometimes people put UNDEFINED in parentGroup or parentLayer
        // that's why there is != instead of !==
        let group = displayObject.parentGroup;
        if (group != null) {
            group.addDisplayObject(this, displayObject);
        }
        const layer = displayObject.parentLayer;
        if (layer != null) {
            group = layer.group;
            group.addDisplayObject(this, displayObject);
        }
        displayObject.updateOrder = ++Stage._updateOrderCounter;
        if (displayObject.alpha <= 0 || !displayObject.renderable
            || !displayObject.layerableChildren
            || group && group.sortPriority) {
            return;
        }
        const children = displayObject.children;
        if (children && children.length) {
            for (let i = 0; i < children.length; i++) {
                this._addRecursive(children[i]);
            }
        }
    }
    _addRecursiveChildren(displayObject) {
        if (displayObject.alpha <= 0 || !displayObject.renderable
            || !displayObject.layerableChildren) {
            return;
        }
        const children = displayObject.children;
        if (children && children.length) {
            for (let i = 0; i < children.length; i++) {
                this._addRecursive(children[i]);
            }
        }
    }
    _updateStageInner() {
        this.clear();
        this._addRecursive(this);
        const layers = this._activeLayers;
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (layer.group.sortPriority) {
                layer.endWork();
                const sorted = layer._sortedChildren;
                for (let j = 0; j < sorted.length; j++) {
                    this._addRecursiveChildren(sorted[j]);
                }
            }
        }
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (!layer.group.sortPriority) {
                layer.endWork();
            }
        }
    }
    updateAsChildStage(stage) {
        this._activeParentStage = stage;
        Stage._updateOrderCounter = 0;
        this._updateStageInner();
    }
    updateStage() {
        this._activeParentStage = null;
        Group_1.Group._layerUpdateId++;
        this._updateStageInner();
    }
    ;
}
exports.Stage = Stage;
Stage._updateOrderCounter = 0;
