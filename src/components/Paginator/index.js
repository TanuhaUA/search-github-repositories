import React from 'react';
// import PropTypes from 'prop-types';

const Paginator = (props) => {
	const {
		currentPage,
		allPages,
		previousClickHandler,
		nextClickHandler,
	} = props;

	return (
		<div>
			<button onClick={previousClickHandler}>previous</button>
			<span>Page {currentPage} from {allPages}</span>
			<button onClick={nextClickHandler}>next</button>
		</div>
	);
};

// Paginator.propTypes = {
// 	currentPage: PropTypes.number.isRequired,
// 	allPages: PropTypes.number.isRequired,
// 	previousClickHandler: PropTypes.func.isRequired,
// 	nextClickHandler: PropTypes.func.isRequired,
// };

export default Paginator;