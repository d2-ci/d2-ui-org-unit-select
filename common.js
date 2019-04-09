'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renderControls = exports.renderDropdown = exports.handleChangeSelection = exports.removeFromSelection = exports.addToSelection = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RaisedButton = require('material-ui/RaisedButton/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _LinearProgress = require('material-ui/LinearProgress/LinearProgress');

var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

var _d2UiCore = require('@dhis2/d2-ui-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
style.button1 = (0, _assign2.default)({}, style.button, { marginLeft: 0 });

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
    return _react2.default.createElement(
        'div',
        { style: { position: 'relative', minHeight: 89 } },
        _react2.default.createElement(_d2UiCore.DropDown, {
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

    return _react2.default.createElement(
        'div',
        { style: { position: 'absolute', display: 'inline-block', top: 24, marginLeft: 16 } },
        this.state.loading && _react2.default.createElement(_LinearProgress2.default, { size: 0.5, style: style.progress }),
        _react2.default.createElement(_RaisedButton2.default, {
            label: this.getTranslation('select'),
            style: style.button1,
            onClick: this.handleSelect,
            disabled: disabled
        }),
        _react2.default.createElement(_RaisedButton2.default, {
            label: this.getTranslation('deselect'),
            style: style.button,
            onClick: this.handleDeselect,
            disabled: disabled
        })
    );
}

exports.addToSelection = addToSelection;
exports.removeFromSelection = removeFromSelection;
exports.handleChangeSelection = handleChangeSelection;
exports.renderDropdown = renderDropdown;
exports.renderControls = renderControls;