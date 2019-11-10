import PropTypes from 'prop-types';
import type from '../type';

export default PropTypes.shape({
    type: PropTypes.any,
    types: PropTypes.arrayOf(type).isRequired,
    forms: PropTypes.any,
});
