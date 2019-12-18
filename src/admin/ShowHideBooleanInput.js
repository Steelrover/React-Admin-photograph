import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import { addField, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';

export class ShowHideBooleanInput extends Component {
    handleChange = (event, value) => {
        this.props.input.onChange(value);
    };

    render() {
        const {
            className,
            id,
            input,
            isRequired,
            label,
            labelOnFalse,
            source,
            resource,
            options,
            fullWidth,
            ...rest
        } = this.props;

        const { value, ...inputProps } = input;

        return (
            <FormGroup className={className} {...sanitizeRestProps(rest)}>
                <FormControlLabel
                    htmlFor={id}
                    control={
                        <Switch
                            id={id}
                            color="primary"
                            checked={!!value}
                            onChange={this.handleChange}
                            {...inputProps}
                            {...options}
                        />
                    }
                    label={
                        <FieldTitle
                            label={!!value ? label : labelOnFalse}
                            source={source}
                            resource={resource}
                            isRequired={isRequired}
                        />
                    }
                />
            </FormGroup>
        );
    }
}

ShowHideBooleanInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
};

ShowHideBooleanInput.defaultProps = {
    options: {},
};

export default addField(ShowHideBooleanInput);
