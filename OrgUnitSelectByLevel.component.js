import _Promise from 'babel-runtime/core-js/promise';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';
import { addToSelection, removeFromSelection, handleChangeSelection, renderDropdown, renderControls } from './common';

var OrgUnitSelectByLevel = function (_React$Component) {
    _inherits(OrgUnitSelectByLevel, _React$Component);

    function OrgUnitSelectByLevel(props, context) {
        _classCallCheck(this, OrgUnitSelectByLevel);

        var _this = _possibleConstructorReturn(this, (OrgUnitSelectByLevel.__proto__ || _Object$getPrototypeOf(OrgUnitSelectByLevel)).call(this, props, context));

        _this.state = {
            loading: false,
            selection: undefined
        };
        _this.levelCache = {};

        _this.addToSelection = addToSelection.bind(_this);
        _this.removeFromSelection = removeFromSelection.bind(_this);
        _this.handleChangeSelection = handleChangeSelection.bind(_this);
        _this.renderControls = renderControls.bind(_this);

        _this.getOrgUnitsForLevel = _this.getOrgUnitsForLevel.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.handleDeselect = _this.handleDeselect.bind(_this);

        var i18n = context.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    _createClass(OrgUnitSelectByLevel, [{
        key: 'getOrgUnitsForLevel',
        value: function getOrgUnitsForLevel(level) {
            var _this2 = this;

            var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var d2 = this.context.d2;
            return new _Promise(function (resolve) {
                if (_this2.props.currentRoot) {
                    var rootLevel = _this2.props.currentRoot.level || _this2.props.currentRoot.path ? _this2.props.currentRoot.path.match(/\//g).length : NaN;
                    var relativeLevel = level - rootLevel;
                    if (isNaN(relativeLevel) || relativeLevel < 0) {
                        log.info('Unable to select org unit levels higher up in the hierarchy than the current root');
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
                        log.debug('Loaded ' + orgUnitArray.length + ' org units for level ' + (relativeLevel + ' under ' + _this2.props.currentRoot.displayName));
                        _this2.setState({ loading: false });
                        resolve(orgUnitArray);
                    });
                } else if (!ignoreCache && _this2.levelCache.hasOwnProperty(level)) {
                    resolve(_this2.levelCache[level].slice());
                } else {
                    log.debug('Loading org units for level ' + level);
                    _this2.setState({ loading: true });

                    d2.models.organisationUnits.list({ paging: false, level: level, fields: 'id,path' }).then(function (orgUnits) {
                        return orgUnits.toArray();
                    }).then(function (orgUnitArray) {
                        log.debug('Loaded ' + orgUnitArray.length + ' org units for level ' + level);
                        _this2.setState({ loading: false });
                        _this2.levelCache[level] = orgUnitArray;

                        // Make a copy of the returned array to ensure that the cache won't be modified from elsewhere
                        resolve(orgUnitArray.slice());
                    }).catch(function (err) {
                        _this2.setState({ loading: false });
                        log.error('Failed to load org units in level ' + level + ':', err);
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
            return renderDropdown.call(this, menuItems, label);
        }
    }]);

    return OrgUnitSelectByLevel;
}(React.Component);

OrgUnitSelectByLevel.propTypes = {
    // levels is an array of either ModelCollection objects or plain objects,
    // where each object should contain `level` and `displayName` properties
    levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,

    // selected is an array of selected organisation unit IDs
    selected: PropTypes.array.isRequired,

    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: PropTypes.func.isRequired,

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

OrgUnitSelectByLevel.contextTypes = { d2: PropTypes.any.isRequired };

export default OrgUnitSelectByLevel;