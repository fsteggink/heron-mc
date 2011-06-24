/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.namespace("Heron.widgets");

/** api: (define)
 *  module = Heron.widgets
 *  class = CapabilitiesTreePanel
 *  base_link = `Ext.tree.TreePanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.tree.TreePanel>`_
 */


/** api: constructor
 *  .. class:: CapabilitiesTreePanel(config)
 *
 *  A panel designed to hold trees of Map Layers from a WMS Capabilties.
 */
Heron.widgets.CapabilitiesTreePanel = Ext.extend(Ext.tree.TreePanel, {

	initComponent : function() {

		var root = new Ext.tree.AsyncTreeNode({
					text: this.hropts.text,
					expanded: this.hropts.preload,
					loader: new GeoExt.tree.WMSCapabilitiesLoader({
								url: this.hropts.url,
								layerOptions: {buffer: 0, singleTile: true, ratio: 1},
								layerParams: {'TRANSPARENT': 'TRUE'},
								// customize the createNode method to add a checkbox to nodes
								createNode: function(attr) {
									attr.checked = attr.leaf ? false : undefined;
									return GeoExt.tree.WMSCapabilitiesLoader.prototype.createNode.apply(this, [attr]);
								}
							})
				});
		this.options = {
			root: root,
			listeners: {
				// Add layers to the map when ckecked, remove when unchecked.
				// Note that this does not take care of maintaining the layer
				// order on the map.
				'checkchange': function(node, checked) {
					var map = Heron.App.getMap();
					// Safeguard
					if (!map) {
						return;
					}

					if (checked === true) {
						map.addLayer(node.attributes.layer);
					} else {
						map.removeLayer(node.attributes.layer);
					}
				}
			}
		};


		Ext.apply(this, this.options);
		Heron.widgets.CapabilitiesTreePanel.superclass.initComponent.call(this);
	}
});

/** api: xtype = hr_CapabilitiesTreePanel */
Ext.reg('hr_capabilitiestreepanel', Heron.widgets.CapabilitiesTreePanel);