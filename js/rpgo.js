function health_table_build() {
    var template_source = $("#template-health-table").html();
    var template = Handlebars.compile(template_source);

    var html = template({attributes: health_attributes_list});
    $("#health-table").html(html);
}

function attribute_table_build() {
    var template_source = $("#template-attributes-table").html();
    var template = Handlebars.compile(template_source);
    var html = template({attributes: attributes_list});
    $("#attributes-table").html(html);
}

function build_attribute_button_handler(prefix) {
    function btn_handler() {
        var button = $(this);
        var attribute = $(prefix + "-" + button.data("type"));
        var value = attribute.data("value") | 0;
        var is_decrem = button.find(".glyphicon-minus").length

        value = is_decrem ? value - 1 : value + 1;

        attribute.data("value", value);
        attribute.text(value).trigger("change");
    }

    return btn_handler;
}

function connect_attribute_buttons(base_prefix, attr_prefix) {
    var buttons = $(base_prefix + " button");

    buttons.click(build_attribute_button_handler(attr_prefix));
}

function connect_attribute_display(prefix, lst) {
    for (var i = 0; i < lst.length; i++) {
        var attribute = $(prefix + "-" + lst[i].type);
        if (attribute) {
            attribute.text(attribute.data("value"));
        }

        attribute.on("change", on_attribute_change);
    }
}

function local_save_data() {
    var save_data = {};

    data_sets.forEach(function(data_set) {
        var data = window[data_set.name];
        save_data[data_set.name] = {};

        for (var i = 0; i < data.length; i++) {
            var attr = data[i].type;
            save_data[data_set.name][attr] = $(data_set.prefix + "-" + attr).data("value");
        }
    });

    window.localStorage.setItem("rpg-data", JSON.stringify(save_data));
}

function local_load_data() {
    var raw_data = window.localStorage.getItem("rpg-data");

    if (!raw_data) {
        return;
    }

    var parsed_data = JSON.parse(raw_data);

    data_sets.forEach(function(data_set) {
        var data = window[data_set.name];

        for (var i = 0; i < data.length; i++) {
            var attr = data[i].type;
            var span_attr = $(data_set.prefix + "-" + attr);
            var value = parsed_data[data_set.name][attr];

            span_attr.data("value", value).text(value).trigger("change");
        }
    });
}

function on_attribute_change(event) {
    var span = $(this);
    console.log(span);
}

var attributes_list = [
    // has 'attribute-' prefix
    { name: "Erő", type: "strength" },
    { name: "Ügyesség", type: "dexterity" },
    { name: "Gyorsaság", type: "speed" },
    { name: "Állóképesség", type: "stanima" },
    { name: "Egészség", type: "health" },
    { name: "Szépség", type: "beauty" },
    { name: "Intelligencia", type: "intelligence" },
    { name: "Akaraterő", type: "will-power" },
    { name: "Asztrál", type: "astral" }
];

var health_attributes_list = [
    // has 'health-' prefix
    { name: "Alap ÉP", type: "base-hp" },
    { name: "Max ÉP", type: "max-hp" },
    { name: "Akt. ÉP:", type: "current-hp" },
];

var data_sets = [
    { name: "attributes_list", prefix: "#attribute" },
    { name: "health_attributes_list", prefix: "#health" },
];

var data_connections = [
    { name: "on-health-change",
      on: "#attribute-health",
      update: "#health-max-hp",
      handler: function (on, update) {
        var health_value = $("#attribute-health").data("value") | 0;
        var value = $("#health-base-hp").data("value") + (health_value > 10 ? health_value - 10 : 0);
        $(update).data("value", value).text(value).trigger("chage");
      }
    },
    { name: "on-base-hp-change",
      on: "#health-base-hp",
      update: "#health-max-hp",
      handler: "on-health-change"    // defer the change operation to the other connection
    },
];

function connect_data_connections() {
    for (var i = 0; i < data_connections.length; i++) {
        var connection = data_connections[i];
        var attribute = $(connection.on);

        if (typeof(connection.handler) === "string") {
            // We found a handler which defers its call to another connection's handler
            // select that handler and modify the current connection.
            for (var j = 0; j < data_connections.length; i++) {
                if (data_connections[j].name == connection.handler) {
                    connection.handler = data_connections[j].handler;
                    break;
                }
            }
        }

        attribute.on("change", connection, on_connected_update);
    }
}

function on_connected_update(e) {
    e.data.handler(e.data.on, e.data.update);
}

$(document).ready(function() {
    attribute_table_build();
    connect_attribute_display("#attribute", attributes_list);
    connect_attribute_buttons("table.attributes", "#attribute");

    health_table_build();
    connect_attribute_display("#health", health_attributes_list);
    connect_attribute_buttons("table.health", "#health");

    connect_data_connections();
    $("#button-load-data").click(local_load_data);
    $("#button-save-data").click(local_save_data);
});
