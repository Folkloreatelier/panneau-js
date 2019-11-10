import PropTypes from 'prop-types';
import lists from '../lists';
import messages from '../messages';

export default PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    lists: lists,
    messages: messages,
    routes: PropTypes.any,
});
