const select = (selected, options) => {
    // refer to https://stackoverflow.com/questions/13046401/how-to-set-selected-select-option-in-handlebars-template
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
};

module.exports = { select };