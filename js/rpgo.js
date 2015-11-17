function build_from_template(prefix, context) {
    var template_source = $(prefix + "-template").html();
    var template = Handlebars.compile(template_source);

    var html = template(context);
    $(prefix + "-content").html(html);
}

function attribute_button_handler() {
    var button = $(this);
    var attribute = $(button.data("target"));
    var value = attribute.data("value") | 0;

    value = (button.data("mode") == "dec") ? value - 1 : value + 1;

    attribute.data("value", value);
    attribute.text(value).trigger("change");
}

function connect_attribute_buttons(base_prefix) {
    var buttons = $(base_prefix + " button");

    buttons.click(attribute_button_handler);
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

function get_attr_selector(attr_name) {
    for (var i = 0; i < data_sets.length; i++) {
        var prefix = data_sets[i].prefix;
        var data_set = window[data_sets[i].name];

        for (var j = 0; j < data_set.length; j++) {
            if (data_set[j].type == attr_name) {
                return prefix + "-" + attr_name;
            }
        }
    }

    return;
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
    { name: "ÉP alap", type: "base-hp" },
    { name: "ÉP max", type: "max-hp" },
    { name: "ÉP akt.", type: "current-hp" },

    { name: "FP alap", type: "base-fp" },
    { name: "FP max", type: "max-fp" },
    { name: "FP akt.", type: "current-fp" },
];

var base_fight_attributes_list = [
    // has 'base-fight-' prefix
    { name: "KÉ alap", type: "ke-base" },
    { name: "KÉ mod.", type: "ke-mod" },
    { name: "KÉ akt.", type: "ke-calc" },

    { name: "TÉ alap", type: "te-base" },
    { name: "TÉ mod.", type: "te-mod" },
    { name: "TÉ akt.", type: "te-calc" },

    { name: "VÉ alap", type: "ve-base" },
    { name: "VÉ mod.", type: "ve-mod" },
    { name: "VÉ akt.", type: "ve-calc" },

    { name: "CÉ alap", type: "ce-base" },
    { name: "CÉ mod.", type: "ce-mod" },
    { name: "CÉ akt.", type: "ce-calc" },
];

var data_sets = [
    { name: "attributes_list", prefix: "#attribute" },
    { name: "health_attributes_list", prefix: "#health" },
    { name: "base_fight_attributes_list", prefix: "#base-fight" },
];

$(document).ready(function() {
    build_from_template("#attributes-table", { attributes: attributes_list });
    connect_attribute_display("#attribute", attributes_list);
    connect_attribute_buttons("table.attributes");

    build_from_template("#health-table", { attributes: health_attributes_list });
    connect_attribute_display("#health", health_attributes_list);
    connect_attribute_buttons("table.health");

    build_from_template("#base-fight-table", { attributes: base_fight_attributes_list });
    connect_attribute_display("#base-fight", base_fight_attributes_list);
    connect_attribute_buttons("table.base-fight");

    Connections.init();
    $("#button-load-data").click(local_load_data);
    $("#button-save-data").click(local_save_data);
});
