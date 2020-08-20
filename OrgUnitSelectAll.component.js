'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _RaisedButton = require('material-ui/RaisedButton/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _common = require('./common');

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

var OrgUnitSelectAll = function (_React$Component) {
    (0, _inherits3.default)(OrgUnitSelectAll, _React$Component);

    function OrgUnitSelectAll(props, context) {
        (0, _classCallCheck3.default)(this, OrgUnitSelectAll);

        var _this = (0, _possibleConstructorReturn3.default)(this, (OrgUnitSelectAll.__proto__ || (0, _getPrototypeOf2.default)(OrgUnitSelectAll)).call(this, props, context));

        _this.state = {
            loading: false,
            cache: null
        };

        _this.addToSelection = _common.addToSelection.bind(_this);
        _this.removeFromSelection = _common.removeFromSelection.bind(_this);

        _this.handleSelectAll = _this.handleSelectAll.bind(_this);
        _this.handleDeselectAll = _this.handleDeselectAll.bind(_this);

        var i18n = context.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    (0, _createClass3.default)(OrgUnitSelectAll, [{
        key: 'handleSelectAll',
        value: function handleSelectAll() {
            var _this2 = this;

            if (this.props.currentRoot) {
                this.setState({ loading: true });
                this.getDescendantOrgUnits().then(function (orgUnits) {
                    _this2.setState({ loading: false });
                    _this2.addToSelection(orgUnits);
                });
            } else if (Array.isArray(this.state.cache)) {
                this.props.onUpdateSelection(this.state.cache.slice());
            } else {
                this.setState({ loading: true });

                this.context.d2.models.organisationUnits.list({ fields: 'id,path', paging: false }).then(function (orgUnits) {
                    var ous = orgUnits.toArray().map(function (ou) {
                        return ou.path;
                    });
                    _this2.setState({
                        cache: ous,
                        loading: false
                    });

                    _this2.props.onUpdateSelection(ous.slice());
                }).catch(function (err) {
                    _this2.setState({ loading: false });
                    _loglevel2.default.error('Failed to load all org units:', err);
                });
            }
        }
    }, {
        key: 'getDescendantOrgUnits',
        value: function getDescendantOrgUnits() {
            return this.context.d2.models.organisationUnits.list({
                root: this.props.currentRoot.id,
                paging: false,
                includeDescendants: true,
                fields: 'id,path'
            });
        }
    }, {
        key: 'handleDeselectAll',
        value: function handleDeselectAll() {
            var _this3 = this;

            if (this.props.currentRoot) {
                this.setState({ loading: true });
                this.getDescendantOrgUnits().then(function (orgUnits) {
                    _this3.setState({ loading: false });
                    _this3.removeFromSelection(orgUnits);
                });
            } else {
                this.props.onUpdateSelection([]);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_RaisedButton2.default, {
                    style: style.button1,
                    label: this.getTranslation('select_all'),
                    onClick: this.handleSelectAll,
                    disabled: this.state.loading
                }),
                _react2.default.createElement(_RaisedButton2.default, {
                    style: style.button,
                    label: this.getTranslation('deselect_all'),
                    onClick: this.handleDeselectAll,
                    disabled: this.state.loading
                })
            );
        }
    }]);
    return OrgUnitSelectAll;
}(_react2.default.Component);

OrgUnitSelectAll.propTypes = {
    // selected is an array of selected organisation unit IDs
    selected: _propTypes2.default.array.isRequired,

    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: _propTypes2.default.func.isRequired,

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: _propTypes2.default.object
};

OrgUnitSelectAll.contextTypes = { d2: _propTypes2.default.object.isRequired };

exports.default = OrgUnitSelectAll;