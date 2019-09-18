import {Group} from './Group';
import {Layer} from './Layer';
import {Point, DisplayObject, ParticleContainer} from 'pixi.js';

declare module "pixi.js" {
    interface DisplayObject {
        parentGroup: Group,
        /**
         * Object will be rendered
         *
         * please specify it to handle zOrder and zIndex
         *
         * its always null for layers
         *
         */
        parentLayer?: Layer,
        _activeParentLayer?: Layer,
        /**
         * zOrder is used to sort element inside the layer
         * It can be used with zIndex together: First PixiJS v5 sorts elements by zIndex inside a container,
         * then pixi-layers plugin sorts by zOrder inside a layer.
         */
        zOrder?: number,
        /**
         * updateOrder is calculated by DisplayList, it is required for sorting inside DisplayGroup
         */
        updateOrder?: number,
        /**
         * displayOrder is calculated by render, it is required for interaction
         */
        displayOrder?: number,
        /**
         * Stage will look inside for elements that can be re-arranged, if this flag is true
         * Make it false for ParticleContainer
         */
        layerableChildren?: boolean
        /**
         * is Layer
         */
        isLayer?: boolean;
        containsPoint?(p: Point): boolean;
    }
}

DisplayObject.prototype.parentLayer = null;
DisplayObject.prototype._activeParentLayer = null;
DisplayObject.prototype.parentGroup = null;
DisplayObject.prototype.zOrder = 0;
DisplayObject.prototype.zIndex = 0;
DisplayObject.prototype.updateOrder = 0;
DisplayObject.prototype.displayOrder = 0;
DisplayObject.prototype.layerableChildren = true;
DisplayObject.prototype.isLayer = false;
ParticleContainer.prototype.layerableChildren = false;
