//
// A gnome-shell extension that moves the top panel to the bottom.
//

/*jshint esnext:true */
/*global imports, global */

const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;

const panelBox = Main.panel.actor.get_parent();
const trayBox = Main.messageTray.actor.get_parent();

let originalPanelY = panelBox.y;
let originalTrayY = trayBox.y;
let trayActorData = null;
let arrowActors = null;

function init() { }

function enable() {
    // Backup original values.
    originalPanelY = panelBox.y;
    originalTrayY = trayBox.y;

    // Move the panel and message tray.
    panelBox.y = trayBox.y = Main.layoutManager.primaryMonitor.height - panelBox.height;

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
    for (var i = arrowActors.length; i-- > 0;)
        arrowActors[i].set_text('\u25BE');
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
