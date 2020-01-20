import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from "./style.module.scss";

class SearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.changeInputValue = this.changeInputValue.bind(this);
		this.submitSearchHandler = this.submitSearchHandler.bind(this);
	}

	changeInputValue(ev) {
		ev.preventDefault();
		const {changeSearchQuery} = this.props;
		changeSearchQuery(ev.target.value);
	}

	submitSearchHandler(ev) {
		ev.preventDefault();
		const {searchRepos} = this.props;

		searchRepos();
	}

	render() {
		const {cancelSearching, searchQuery} = this.props;

		return (
			<form
				className={styles.form}
				onSubmit={this.submitSearchHandler}
			>
				<input
					type="text"
					name="search"
					className={styles.form__input}
					placeholder="Enter a repository name"
					value={searchQuery}
					onChange={this.changeInputValue}
				/>
				<div className={styles.form__buttons}>
					<button
						type="submit"
						className={classNames(styles.form__btn, styles.form__btn_submit)}
					>Search</button>
					<button
						type="button"
						onClick={cancelSearching}
						className={classNames(styles.form__btn, styles.form__btn_cancel)}
					>Cancel&nbsp;searching</button>
				</div>
			</form>
		);
	}
}

SearchForm.propTypes = {
	cancelSearching: PropTypes.func.isRequired,
	changeSearchQuery: PropTypes.func.isRequired,
	searchQuery: PropTypes.string.isRequired,
	searchRepos: PropTypes.func.isRequired
};

export default SearchForm;