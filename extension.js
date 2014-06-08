//
// A gnome-shell extension that moves the top panel to the bottom.
//

/*jshint esnext:true */
/*global imports, global */

const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;

const panelBox = Main.layoutManager.panelBox;
const trayBox = Main.layoutManager.trayBox;

let originalPanelY = panelBox.y,
    originalTrayY = trayBox.y,
    trayActorData = null,
    arrowActors = null,
    panelAllocationHandlerId;

function init() { }

function enable() {
    // Backup original values.
    originalPanelY = panelBox.y;
    originalTrayY = trayBox.y;

    // Watch the panel size and move it along with the tray.
    movePanel();
    panelAllocationHandlerId = panelBox.connect('allocation-changed', movePanel);

    // Make the panel raise above the message tray.
    // XXX: Should this be restored when disabling? How?
    panelBox.raise(trayBox);

    // Make the message tray track fullscreen-ness and disappear accordingly.
    let trackDatas = Main.layoutManager._trackedActors;
    for (let i = 0, len = trackDatas.length; i < len; ++i) {
        let actorData = trackDatas[i];
        if (actorData.actor === trayBox) {
            actorData.trackFullscreen = true;
            trayActorData = actorData;
            break;
        }
    }

    // Change arrows' direction in panel.
    arrowActors = [];
    turnArrows(Main.panel.statusArea.aggregateMenu._indicators);
    turnArrows(Main.panel.statusArea.appMenu._hbox);
}

function disable() {
    panelBox.y = originalPanelY;
    trayBox.y = originalTrayY;
    trayActorData.trackFullscreen = false;
    panelBox.disconnect(panelAllocationHandlerId);
    for (var i = arrowActors.length; i-- > 0;)
        arrowActors[i].set_text('\u25BE');
}

function movePanel() {
    var newY = Main.layoutManager.primaryMonitor.height - panelBox.height;
    panelBox.y = trayBox.y = newY;
}

function turnArrows(actor) {
    let children = actor.get_children();
    for (let i = children.length; i-- > 0;) {
        let child = children[i];
        if (child.has_style_class_name('unicode-arrow')) {
            child.set_text('\u25B4');
            arrowActors.push(child);
            break;
        }
    }
}
