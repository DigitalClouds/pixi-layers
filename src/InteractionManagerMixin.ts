//TODO: add maxDisplayOrder for displayObjects and use it to speed up the interaction here
import {DisplayObject, Point, Graphics, Container} from 'pixi.js';
import InteractionManager = PIXI.interaction.InteractionManager;
import InteractionEvent = PIXI.interaction.InteractionEvent;

declare module 'pixi.js' {
    namespace interaction {
        interface InteractionManager {
            _queue: [Array<DisplayObject>, Array<DisplayObject>];
            _displayProcessInteractive: (point: Point, displayObject: DisplayObject, hitTestOrder: number, interactive: boolean, outOfMask: boolean) => number;
            _startInteractionProcess: () => void;
            _queueAdd: (displayObject: DisplayObject, order: number) => void;
            _finishInteractionProcess: (event: InteractionEvent, func: Function) => void;
        }
    }
}

InteractionManager.prototype._queue= [[], []];
/**
 * This is private recursive copy of processInteractive
 */
InteractionManager.prototype._displayProcessInteractive = function (point: Point, displayObject: DisplayObject, hitTestOrder: number, interactive: boolean, outOfMask?: boolean): number {
    if (!displayObject || !displayObject.visible) {
        return 0;
    }

    // Took a little while to rework this function correctly! But now it is done and nice and optimised. ^_^
    //
    // This function will now loop through all objects and then only hit test the objects it HAS to, not all of them. MUCH faster..
    // An object will be hit test if the following is true:
    //
    // 1: It is interactive.
    // 2: It belongs to a parent that is interactive AND one of the parents children have not already been hit.
    //
    // As another little optimisation once an interactive object has been hit we can carry on through the scenegraph, but we know that there will be no more hits! So we can avoid extra hit tests
    // A final optimisation is that an object is not hit test directly if a child has already been hit.

    let hit = 0,
        interactiveParent = interactive = displayObject.interactive || interactive;

    // if the displayobject has a hitArea, then it does not need to hitTest children.
    if (displayObject.hitArea) {
        interactiveParent = false;
    }

    if (displayObject._activeParentLayer) {
        outOfMask = false;
    }

    // it has a mask! Then lets hit test that before continuing..
    const mask: Graphics = (displayObject as any)._mask;
    if (hitTestOrder < Infinity && mask) {
        if (!mask.containsPoint(point)) {
            outOfMask = true;
        }
    }

    // it has a filterArea! Same as mask but easier, its a rectangle
    if (hitTestOrder < Infinity && displayObject.filterArea) {
        if (!displayObject.filterArea.contains(point.x, point.y)) {
            outOfMask = true;
        }
    }

    // ** FREE TIP **! If an object is not interactive or has no buttons in it
    // (such as a game scene!) set interactiveChildren to false for that displayObject.
    // This will allow pixi to completely ignore and bypass checking the displayObjects children.
    const children: Array<DisplayObject> = (displayObject as Container).children;
    if ((displayObject as Container).interactiveChildren && children) {
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];

            // time to get recursive.. if this function will return if something is hit..
            const hitChild = this._displayProcessInteractive(point, child, hitTestOrder, interactiveParent, outOfMask);
            if (hitChild) {
                // its a good idea to check if a child has lost its parent.
                // this means it has been removed whilst looping so its best
                if (!child.parent) {
                    continue;
                }

                hit = hitChild;
                hitTestOrder = hitChild;
            }
        }
    }

    // no point running this if the item is not interactive or does not have an interactive parent.
    if (interactive) {
        if (!outOfMask) {
            // if we are hit testing (as in we have no hit any objects yet)
            // We also don't need to worry about hit testing if once of the displayObjects children has already been hit!
            if (hitTestOrder < displayObject.displayOrder) {
                //pixi v4
                if (displayObject.hitArea) {
                    displayObject.worldTransform.applyInverse(point, this._tempPoint);
                    if (displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) {
                        hit = displayObject.displayOrder;
                    }
                } else if ((displayObject as any).containsPoint) {
                    if ((displayObject as any).containsPoint(point)) {
                        hit = displayObject.displayOrder;
                    }
                }
            }

            if (displayObject.interactive) {
                this._queueAdd(displayObject, hit === Infinity ? 0 : hit);
            }
        } else {
            if (displayObject.interactive) {
                this._queueAdd(displayObject, 0);
            }
        }
    }

    return hit;

};

// this is protected, so use index accessor to force typescript to be ok with this
InteractionManager.prototype['processInteractive'] = function (strangeStuff: InteractionEvent | Point, displayObject: DisplayObject, func: Function, hitTest: boolean, interactive: boolean): boolean {
    //older versions
    let interactionEvent: InteractionEvent = null;
    let point: Point = null;
    if ((strangeStuff as InteractionEvent).data &&
        (strangeStuff as InteractionEvent).data.global) {
        interactionEvent = strangeStuff as InteractionEvent;
        point = interactionEvent.data.global;
    } else {
        point = strangeStuff as Point;
    }
    this._startInteractionProcess();
    const hit = this._displayProcessInteractive(point, displayObject, hitTest ? 0 : Infinity, false);
    this._finishInteractionProcess(interactionEvent, func);
    // Need to return a boolean, was previously void.
    return !!hit;
};

InteractionManager.prototype._startInteractionProcess = function () {
    //move it to constructor
    this._eventDisplayOrder = 1;
    if (!this._queue) {
        //move it to constructor
        this._queue = [[], []];
    }
    this._queue[0].length = 0;
    this._queue[1].length = 0;
};

InteractionManager.prototype._queueAdd = function (displayObject: DisplayObject, order: number) {
    let queue = this._queue;
    if (order < this._eventDisplayOrder) {
        queue[0].push(displayObject);
    } else {
        if (order > this._eventDisplayOrder) {
            this._eventDisplayOrder = order;
            let q = queue[1];
            for (let i = 0, l = q.length; i < l; i++) {
                queue[0].push(q[i]);
            }
            queue[1].length = 0;
        }
        queue[1].push(displayObject);
    }
};
InteractionManager.prototype._finishInteractionProcess = function (event: InteractionEvent, func: Function) {
    let queue = this._queue;
    let q = queue[0];
    for (let i = 0, l = q.length; i < l; i++) {
        if (event) {
            //v4.3
            if (func) {
                func(event, q[i], false);
            }
        } else {
            //old
            func(q[i], false);
        }
    }
    q = queue[1];
    for (let i = 0, l = q.length; i < l; i++) {
        if (event) {
            //v4.3
            if (!event.target) {
                event.target = q[i];
            }
            if (func) {
                func(event, q[i], true);
            }
        } else {
            //old
            func(q[i], true);
        }
    }
    const delayedEvents = this.delayedEvents;

    if (delayedEvents && delayedEvents.length) {
        // Reset the propagation hint, because we start deeper in the tree again.
        (event as any).stopPropagationHint = false;

        const delayedLen = delayedEvents.length;

        this.delayedEvents = [];

        for (let i = 0; i < delayedLen; i++) {
            const {displayObject, eventString, eventData} = delayedEvents[i];

            // When we reach the object we wanted to stop propagating at,
            // set the propagation hint.
            if (eventData.stopsPropagatingAt === displayObject) {
                eventData.stopPropagationHint = true;
            }

            this.dispatchEvent(displayObject, eventString, eventData);
        }
    }
};

