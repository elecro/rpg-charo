var Connections;

$(document).ready(function() {

    function handler_attribute_change (on, update) {
        var value = calculate_from_attrs(on);
        $(update).data("value", value).text(value).trigger("change");
    }

    var attr = get_attr_selector;
    connections = [
        {
            name: "on-hp-attr-change",
            on: [attr("health"), attr("base-hp")],
            update: attr("max-hp"),
            handler: handler_attribute_change
        },
        {
            name: "on-fp-attr-change",
            on: [attr("stanima"), attr("will-power"), attr("base-fp")],
            update: attr("max-fp"),
            handler: handler_attribute_change
        },
        {
            name: "on-ke-attr-change",
            on: [attr("dexterity"), attr("speed"), attr("ke-base"), attr("ke-mod")],
            update: attr("ke-calc"),
            handler: handler_attribute_change
        },
        {
            name: "on-te-attr-change",
            on: [attr("strength"), attr("dexterity"), attr("speed"), attr("te-base"), attr("te-mod")],
            update: attr("te-calc"),
            handler: handler_attribute_change
        },
        {
            name: "on-ve-attr-change",
            on: [attr("dexterity"), attr("speed"), attr("ve-base"), attr("ve-mod")],
            update: attr("ve-calc"),
            handler: handler_attribute_change
        },
        {
            name: "on-ce-attr-change",
            on: [attr("dexterity"), attr("ce-base"), attr("ce-mod")],
            update: attr("ce-calc"),
            handler: handler_attribute_change
        },
    ];

    var DataConnector = function(connections) {
        this.connections = connections;
        this.connections.forEach(this.try_reslove_defered_handler);
    };

    DataConnector.prototype.init = function() {
        for (var i = 0; i < this.connections.length; i++) {
            this.connect_single(this.connections[i]);
        }
    };

    DataConnector.prototype.connect_single = function (connection) {
        for (var i = 0; i < connection.on.length; i++) {
            var attribute = $(connection.on[i]);
            attribute.on("change", connection, this.on_connected_update);
        }
    };

    DataConnector.prototype.on_connected_update = function(e) {
        e.data.handler(e.data.on, e.data.update);
    };

    DataConnector.prototype.try_reslove_defered_handler = function(connection) {
        if (typeof(connection.handler) === "string") {
            // We found a handler which defers its call to another connection's handler
            // select that handler and modify the current connection.
            for (var i = 0; i < this.connections.length; i++) {
                if (this.connections[i].name == connection.handler) {
                    connection.handler = this.connections[i].handler;
                    break;
                }
            }
        }
    };

    Connections = new DataConnector(connections);
});
