import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const Paginator = (props) => {
	const {
		currentPage,
		pagesNumber,
		previousClickHandler,
		nextClickHandler,
	} = props;

	return (
		<div className={styles.paginator}>
			<button
				className={styles.paginator__btn}
				onClick={previousClickHandler}
				disabled={currentPage <= 1}
			>&lt;&lt; prev</button>
			<span>page <span className={styles.paginator__highlight}>{currentPage}</span> from <span className={styles.paginator__highlight}>{pagesNumber}</span></span>
			<button
				className={styles.paginator__btn}
				onClick={nextClickHandler}
				disabled={currentPage >= pagesNumber}
			>next &gt;&gt;</button>
		</div>
	);
};

Paginator.propTypes = {
	currentPage: PropTypes.number.isRequired,
	pagesNumber: PropTypes.number.isRequired,
	previousClickHandler: PropTypes.func.isRequired,
	nextClickHandler: PropTypes.func.isRequired,
};

export default Paginator;
