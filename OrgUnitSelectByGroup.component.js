'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OrgUnitSelectByGroup = function (_React$Component) {
    (0, _inherits3.default)(OrgUnitSelectByGroup, _React$Component);

    function OrgUnitSelectByGroup(props, context) {
        (0, _classCallCheck3.default)(this, OrgUnitSelectByGroup);

        var _this = (0, _possibleConstructorReturn3.default)(this, (OrgUnitSelectByGroup.__proto__ || (0, _getPrototypeOf2.default)(OrgUnitSelectByGroup)).call(this, props, context));

        _this.state = {
            loading: false,
            selection: undefined
        };
        _this.groupCache = {};

        _this.addToSelection = _common.addToSelection.bind(_this);
        _this.removeFromSelection = _common.removeFromSelection.bind(_this);
        _this.handleChangeSelection = _common.handleChangeSelection.bind(_this);
        _this.renderControls = _common.renderControls.bind(_this);

        _this.getOrgUnitsForGroup = _this.getOrgUnitsForGroup.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.handleDeselect = _this.handleDeselect.bind(_this);

        var i18n = context.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    (0, _createClass3.default)(OrgUnitSelectByGroup, [{
        key: 'getOrgUnitsForGroup',
        value: function getOrgUnitsForGroup(groupId) {
            var _this2 = this;

            var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var d2 = this.context.d2;
            return new _promise2.default(function (resolve) {
                if (_this2.props.currentRoot) {
                    _loglevel2.default.debug('Loading org units for group ' + groupId + ' within ' + _this2.props.currentRoot.displayName);
                    _this2.setState({ loading: true });

                    d2.models.organisationUnits.list({
                        root: _this2.props.currentRoot.id,
                        paging: false,
                        includeDescendants: true,
                        fields: 'id,path',
                        filter: 'organisationUnitGroups.id:eq:' + groupId
                    }).then(function (orgUnits) {
                        return orgUnits.toArray();
                    }).then(function (orgUnits) {
                        _loglevel2.default.debug('Loaded ' + orgUnits.length + ' org units for group ' + groupId + ' within ' + _this2.props.currentRoot.displayName);
                        _this2.setState({ loading: false });

                        resolve(orgUnits.slice());
                    });
                } else if (!ignoreCache && _this2.groupCache.hasOwnProperty(groupId)) {
                    resolve(_this2.groupCache[groupId].slice());
                } else {
                    _loglevel2.default.debug('Loading org units for group ' + groupId);
                    _this2.setState({ loading: true });

                    var _d = _this2.context.d2;
                    _d.models.organisationUnitGroups.get(groupId, { fields: 'organisationUnits[id,path]' }).then(function (orgUnitGroups) {
                        return orgUnitGroups.organisationUnits.toArray();
                    }).then(function (orgUnits) {
                        _loglevel2.default.debug('Loaded ' + orgUnits.length + ' org units for group ' + groupId);
                        _this2.setState({ loading: false });
                        _this2.groupCache[groupId] = orgUnits;

                        // Make a copy of the returned array to ensure that the cache won't be modified from elsewhere
                        resolve(orgUnits.slice());
                    }).catch(function (err) {
                        _this2.setState({ loading: false });
                        _loglevel2.default.error('Failed to load org units in group ' + groupId + ':', err);
                    });
                }
            });
        }
    }, {
        key: 'handleSelect',
        value: function handleSelect() {
            this.getOrgUnitsForGroup(this.state.selection).then(this.addToSelection);
        }
    }, {
        key: 'handleDeselect',
        value: function handleDeselect() {
            this.getOrgUnitsForGroup(this.state.selection).then(this.removeFromSelection);
        }
    }, {
        key: 'render',
        value: function render() {
            var menuItems = Array.isArray(this.props.groups) && this.props.groups || this.props.groups.toArray();

            var label = 'organisation_unit_group';

            // The minHeight on the wrapping div below is there to compensate for the fact that a
            // Material-UI SelectField will change height depending on whether or not it has a value
            return _common.renderDropdown.call(this, menuItems, label);
        }
    }]);
    return OrgUnitSelectByGroup;
}(_react2.default.Component);

OrgUnitSelectByGroup.propTypes = {
    // groups is an array of either ModelCollection objects or plain objects,
    // where each object should contain `id` and `displayName` properties
    groups: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]).isRequired,

    // selected is an array of selected organisation unit IDs
    selected: _propTypes2.default.array.isRequired,

    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: _propTypes2.default.func.isRequired,

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: _propTypes2.default.object

    // TODO: Add group cache prop?
};

OrgUnitSelectByGroup.contextTypes = { d2: _propTypes2.default.any.isRequired };

exports.default = OrgUnitSelectByGroup;