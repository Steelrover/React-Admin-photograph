import React from 'react';
import PropTypes from 'prop-types';

const ShowHideField = ({ record = {}, source }) =>
    <span>
        {(record[source]) ? 'Показано' : 'Скрыто'}
    </span>;

ShowHideField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

export default ShowHideField;
