import PropTypes from 'prop-types';
import field from './field';

export default PropTypes.shape({
    type: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(field),
});
