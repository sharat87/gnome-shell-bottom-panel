//
// A gnome-shell extension that moves the top panel to the bottom.
//
// TODO:
// - The panel disappears behind the message tray when it is opened.
//

/*jshint esnext:true */
/*global imports, global */

const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;

const panelActor = Main.panel.actor;
const panelBox = panelActor.get_parent();

let originalPanelY = panelBox.y;
let arrowActors = null;

function init() { }

function enable() {
    originalPanelY = panelBox.y;
    panelBox.y = global.screen.get_monitor_geometry(0).height - panelActor.get_height();
    arrowActors = [];
    turnArrows(Main.panel.statusArea.aggregateMenu._indicators);
    turnArrows(Main.panel.statusArea.appMenu._hbox);
}

function disable() {
    panelBox.y = originalPanelY;
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
