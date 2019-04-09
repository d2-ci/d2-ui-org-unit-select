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

var OrgUnitSelectByLevel = function (_React$Component) {
    (0, _inherits3.default)(OrgUnitSelectByLevel, _React$Component);

    function OrgUnitSelectByLevel(props, context) {
        (0, _classCallCheck3.default)(this, OrgUnitSelectByLevel);

        var _this = (0, _possibleConstructorReturn3.default)(this, (OrgUnitSelectByLevel.__proto__ || (0, _getPrototypeOf2.default)(OrgUnitSelectByLevel)).call(this, props, context));

        _this.state = {
            loading: false,
            selection: undefined
        };
        _this.levelCache = {};

        _this.addToSelection = _common.addToSelection.bind(_this);
        _this.removeFromSelection = _common.removeFromSelection.bind(_this);
        _this.handleChangeSelection = _common.handleChangeSelection.bind(_this);
        _this.renderControls = _common.renderControls.bind(_this);

        _this.getOrgUnitsForLevel = _this.getOrgUnitsForLevel.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.handleDeselect = _this.handleDeselect.bind(_this);

        var i18n = context.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    (0, _createClass3.default)(OrgUnitSelectByLevel, [{
        key: 'getOrgUnitsForLevel',
        value: function getOrgUnitsForLevel(level) {
            var _this2 = this;

            var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var d2 = this.context.d2;
            return new _promise2.default(function (resolve) {
                if (_this2.props.currentRoot) {
                    var rootLevel = _this2.props.currentRoot.level || _this2.props.currentRoot.path ? _this2.props.currentRoot.path.match(/\//g).length : NaN;
                    var relativeLevel = level - rootLevel;
                    if (isNaN(relativeLevel) || relativeLevel < 0) {
                        _loglevel2.default.info('Unable to select org unit levels higher up in the hierarchy than the current root');
                        return resolve([]);
                    }

                    d2.models.organisationUnits.list({
                        paging: false,
                        level: level - rootLevel,
                        fields: 'id,path',
                        root: _this2.props.currentRoot.id
                    }).then(function (orgUnits) {
                        return orgUnits.toArray();
                    }).then(function (orgUnitArray) {
                        _loglevel2.default.debug('Loaded ' + orgUnitArray.length + ' org units for level ' + (relativeLevel + ' under ' + _this2.props.currentRoot.displayName));
                        _this2.setState({ loading: false });
                        resolve(orgUnitArray);
                    });
                } else if (!ignoreCache && _this2.levelCache.hasOwnProperty(level)) {
                    resolve(_this2.levelCache[level].slice());
                } else {
                    _loglevel2.default.debug('Loading org units for level ' + level);
                    _this2.setState({ loading: true });

                    d2.models.organisationUnits.list({ paging: false, level: level, fields: 'id,path' }).then(function (orgUnits) {
                        return orgUnits.toArray();
                    }).then(function (orgUnitArray) {
                        _loglevel2.default.debug('Loaded ' + orgUnitArray.length + ' org units for level ' + level);
                        _this2.setState({ loading: false });
                        _this2.levelCache[level] = orgUnitArray;

                        // Make a copy of the returned array to ensure that the cache won't be modified from elsewhere
                        resolve(orgUnitArray.slice());
                    }).catch(function (err) {
                        _this2.setState({ loading: false });
                        _loglevel2.default.error('Failed to load org units in level ' + level + ':', err);
                    });
                }
            });
        }
    }, {
        key: 'handleSelect',
        value: function handleSelect() {
            var _this3 = this;

            this.getOrgUnitsForLevel(this.state.selection).then(function (orgUnits) {
                _this3.addToSelection(orgUnits);
            });
        }
    }, {
        key: 'handleDeselect',
        value: function handleDeselect() {
            var _this4 = this;

            this.getOrgUnitsForLevel(this.state.selection).then(function (orgUnits) {
                _this4.removeFromSelection(orgUnits);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var currentRoot = this.props.currentRoot;
            var currentRootLevel = currentRoot ? currentRoot.level || currentRoot.path.match(/\//g).length : 1;

            var menuItems = (Array.isArray(this.props.levels) && this.props.levels || this.props.levels.toArray()).filter(function (level) {
                return level.level >= currentRootLevel;
            }).map(function (level) {
                return { id: level.level, displayName: level.displayName };
            });
            var label = 'organisation_unit_level';

            // The minHeight on the wrapping div below is there to compensate for the fact that a
            // Material-UI SelectField will change height depending on whether or not it has a value
            return _common.renderDropdown.call(this, menuItems, label);
        }
    }]);
    return OrgUnitSelectByLevel;
}(_react2.default.Component);

OrgUnitSelectByLevel.propTypes = {
    // levels is an array of either ModelCollection objects or plain objects,
    // where each object should contain `level` and `displayName` properties
    levels: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array]).isRequired,

    // selected is an array of selected organisation unit IDs
    selected: _propTypes2.default.array.isRequired,

    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: _propTypes2.default.func.isRequired,

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: function currentRoot(props, propName) {
        if (props[propName]) {
            if (!props[propName].hasOwnProperty('id')) {
                return new Error('currentRoot must have an `id` property');
            }

            if (!props[propName].hasOwnProperty('level') && !props[propName].hasOwnProperty('path')) {
                return new Error('currentRoot must have either a `level` or a `path` property');
            }
        }
    }

    // TODO: Add level cache prop?
};

OrgUnitSelectByLevel.contextTypes = { d2: _propTypes2.default.any.isRequired };

exports.default = OrgUnitSelectByLevel;