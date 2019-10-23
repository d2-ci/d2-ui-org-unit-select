import _Object$assign from 'babel-runtime/core-js/object/assign';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';
import { DropDown } from '@dhis2/d2-ui-core';

var style = {
    button: {
        position: 'relative',
        top: 3,
        marginLeft: 16
    },
    progress: {
        height: 2,
        backgroundColor: 'rgba(0,0,0,0)',
        top: 46
    }
};
style.button1 = _Object$assign({}, style.button, { marginLeft: 0 });

function addToSelection(orgUnits) {
    var _this = this;

    var orgUnitArray = Array.isArray(orgUnits) ? orgUnits : orgUnits.toArray();
    var addedOus = orgUnitArray.filter(function (ou) {
        return !_this.props.selected.includes(ou.path);
    });

    this.props.onUpdateSelection(this.props.selected.concat(addedOus.map(function (ou) {
        return ou.path;
    })));
}

function removeFromSelection(orgUnits) {
    var _this2 = this;

    var orgUnitArray = Array.isArray(orgUnits) ? orgUnits : orgUnits.toArray();
    var removedOus = orgUnitArray.filter(function (ou) {
        return _this2.props.selected.includes(ou.path);
    });
    var removed = removedOus.map(function (ou) {
        return ou.path;
    });
    var selectedOus = this.props.selected.filter(function (ou) {
        return !removed.includes(ou);
    });

    this.props.onUpdateSelection(selectedOus);
}

function handleChangeSelection(event) {
    this.setState({ selection: event.target.value });
}

function renderDropdown(menuItems, label) {
    return React.createElement(
        'div',
        { style: { position: 'relative', minHeight: 89 } },
        React.createElement(DropDown, {
            value: this.state.selection,
            menuItems: menuItems,
            onChange: this.handleChangeSelection,
            floatingLabelText: this.getTranslation(label),
            disabled: this.state.loading
        }),
        this.renderControls()
    );
}

function renderControls() {
    var disabled = this.state.loading || !this.state.selection;

    return React.createElement(
        'div',
        { style: { position: 'absolute', display: 'inline-block', top: 24, marginLeft: 16 } },
        this.state.loading && React.createElement(LinearProgress, { size: 0.5, style: style.progress }),
        React.createElement(RaisedButton, {
            label: this.getTranslation('select'),
            style: style.button1,
            onClick: this.handleSelect,
            disabled: disabled
        }),
        React.createElement(RaisedButton, {
            label: this.getTranslation('deselect'),
            style: style.button,
            onClick: this.handleDeselect,
            disabled: disabled
        })
    );
}

export { addToSelection, removeFromSelection, handleChangeSelection, renderDropdown, renderControls };