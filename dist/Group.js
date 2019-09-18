"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
require("./DisplayObjectMixin");
/**
 * A shared component for multiple DisplayObject's allows to specify rendering order for them
 *
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 * @param zIndex {number} z-index for display group
 * @param sorting {boolean | Function} if you need to sort elements inside, please provide function that will set displayObject.zOrder accordingly
 */
class Group extends pixi_js_1.utils.EventEmitter {
    constructor(zIndex, sorting) {
        super();
        this._activeLayer = null;
        this._activeStage = null;
        this._activeChildren = [];
        this._lastUpdateId = -1;
        this.useRenderTexture = false;
        this.useDoubleBuffer = false;
        this.sortPriority = 0;
        this.clearColor = new Float32Array([0, 0, 0, 0]);
        //TODO: handle orphan groups
        //TODO: handle groups that don't want to be drawn in parent
        this.canDrawWithoutLayer = false;
        this.canDrawInParentStage = true;
        /**
         * default zIndex value for layers that are created with this Group
         * @type {number}
         */
        this.zIndex = 0;
        this.enableSort = false;
        this._tempResult = [];
        this._tempZero = [];
        this.useZeroOptimization = false;
        this.zIndex = zIndex;
        this.enableSort = !!sorting;
        if (typeof sorting === 'function') {
            this.on('sort', sorting);
        }
    }
    doSort(layer, sorted) {
        if (this.listeners('sort', true)) {
            for (let i = 0; i < sorted.length; i++) {
                this.emit('sort', sorted[i]);
            }
        }
        if (this.useZeroOptimization) {
            this.doSortWithZeroOptimization(layer, sorted);
        }
        else {
            sorted.sort(Group.compareZIndex);
        }
    }
    static compareZIndex(a, b) {
        if (a.zOrder < b.zOrder) {
            return -1;
        }
        if (a.zOrder > b.zOrder) {
            return 1;
        }
        return a.updateOrder - b.updateOrder;
    }
    doSortWithZeroOptimization(layer, sorted) {
        throw new Error("not implemented yet");
        //default sorting
        // const result = this._tempResult;
        // const zero = this._tempZero;
        // for (let i = 0; i < sorted.length; i++) {
        //     const elem = sorted[i];
        //     if (elem.zIndex == 0 && elem.zOrder == 0) {
        //         zero.push(elem);
        //     } else {
        //         result.push(elem);
        //     }
        // }
        // if (zero.length == 0) {
        //     sorted.sort(Group.compareZOrder);
        // } else {
        //     result.sort(Group.compareZOrder);
        //     let j = 0;
        //     for (let i = 0; i < result.length; i++) {
        //         const elem = result[i];
        //         if (elem.zIndex < 0 && elem.zIndex == 0 && elem.zOrder > 0) {
        //             sorted[j++] = result[i]++;
        //         }
        //     }
        // }
    }
    /**
     * clears temporary variables
     */
    clear() {
        this._activeLayer = null;
        this._activeStage = null;
        this._activeChildren.length = 0;
    }
    /**
     * used only by displayList before sorting takes place
     */
    addDisplayObject(stage, displayObject) {
        this.check(stage);
        displayObject._activeParentLayer = this._activeLayer;
        if (this._activeLayer) {
            this._activeLayer._activeChildren.push(displayObject);
        }
        else {
            this._activeChildren.push(displayObject);
        }
    }
    /**
     * called when corresponding layer is found in current stage
     * @param stage
     * @param layer
     */
    foundLayer(stage, layer) {
        this.check(stage);
        if (this._activeLayer != null) {
            Group.conflict();
        }
        this._activeLayer = layer;
        this._activeStage = stage;
    }
    /**
     * called after stage finished the work
     * @param stage
     */
    foundStage(stage) {
        if (!this._activeLayer && !this.canDrawInParentStage) {
            this.clear();
        }
    }
    check(stage) {
        if (this._lastUpdateId < Group._layerUpdateId) {
            this._lastUpdateId = Group._layerUpdateId;
            this.clear();
            this._activeStage = stage;
        }
        else if (this.canDrawInParentStage) {
            let current = this._activeStage;
            while (current && current != stage) {
                current = current._activeParentStage;
            }
            this._activeStage = current;
            if (current == null) {
                this.clear();
                return;
            }
        }
    }
    static conflict() {
        if (Group._lastLayerConflict + 5000 < Date.now()) {
            Group._lastLayerConflict = Date.now();
            console.log("PIXI-display plugin found two layers with the same group in one stage - that's not healthy. Please place a breakpoint here and debug it");
        }
    }
}
exports.Group = Group;
Group._layerUpdateId = 0;
Group._lastLayerConflict = 0;
