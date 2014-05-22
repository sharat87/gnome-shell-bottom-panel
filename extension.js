//
// A gnome-shell extension that moves the top panel to the bottom.
//
// TODO:
// - The panel disappears behind the message tray when it is opened.
//

/*jshint esnext:true */
/*global imports, global */

const Main = imports.ui.main;

const panelActor = Main.panel.actor;
const panelBox = panelActor.get_parent();

let originalPanelY = panelBox.y;

function init() { }

function enable() {
    originalPanelY = panelBox.y;
    panelBox.y = global.screen.get_monitor_geometry(0).height - panelActor.get_height();
}

function disable() {
    panelBox.y = originalPanelY;
}
