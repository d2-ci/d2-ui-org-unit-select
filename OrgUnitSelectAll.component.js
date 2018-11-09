import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import React from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';

import { addToSelection, removeFromSelection } from './common';

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

var OrgUnitSelectAll = function (_React$Component) {
    _inherits(OrgUnitSelectAll, _React$Component);

    function OrgUnitSelectAll(props, context) {
        _classCallCheck(this, OrgUnitSelectAll);

        var _this = _possibleConstructorReturn(this, (OrgUnitSelectAll.__proto__ || _Object$getPrototypeOf(OrgUnitSelectAll)).call(this, props, context));

        _this.state = {
            loading: false,
            cache: null
        };

        _this.addToSelection = addToSelection.bind(_this);
        _this.removeFromSelection = removeFromSelection.bind(_this);

        _this.handleSelectAll = _this.handleSelectAll.bind(_this);
        _this.handleDeselectAll = _this.handleDeselectAll.bind(_this);

        var i18n = context.d2.i18n;
        _this.getTranslation = i18n.getTranslation.bind(i18n);
        return _this;
    }

    _createClass(OrgUnitSelectAll, [{
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
                    log.error('Failed to load all org units:', err);
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
            return React.createElement(
                'div',
                null,
                React.createElement(RaisedButton, {
                    style: style.button1,
                    label: this.getTranslation('select_all'),
                    onClick: this.handleSelectAll,
                    disabled: this.state.loading
                }),
                React.createElement(RaisedButton, {
                    style: style.button,
                    label: this.getTranslation('deselect_all'),
                    onClick: this.handleDeselectAll,
                    disabled: this.state.loading
                })
            );
        }
    }]);

    return OrgUnitSelectAll;
}(React.Component);

OrgUnitSelectAll.propTypes = {
    // selected is an array of selected organisation unit IDs
    selected: PropTypes.array.isRequired,

    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: PropTypes.func.isRequired,

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: PropTypes.object
};

OrgUnitSelectAll.contextTypes = { d2: PropTypes.object.isRequired };

export default OrgUnitSelectAll;