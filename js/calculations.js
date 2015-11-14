function over_10(value) {
    return value > 10 ? value - 10 : 0;
}

function calculate_from_attrs(attr_list) {
    var value = 0;

    for (var i = 0; i < attr_list.length; i++) {
        var attr_value = $(attr_list[i]).data("value") | 0;

        if (attr_list[i].startsWith("#attribute-")) {
            // Found a base attribute so we'll take the number's value above ten
            attr_value = Math.max(attr_value - 10, 0);
        }

        value += attr_value;
    }

    return value;
}

function handler_attribute_change (on, update) {
    var value = calculate_from_attrs(on);
    $(update).data("value", value).text(value).trigger("change");
}
