import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from "./style.module.scss";

class SearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: '',
		};
		this.changeSearchQuery = this.changeSearchQuery.bind(this);
		this.submitSearchHandler = this.submitSearchHandler.bind(this);
	}

	changeSearchQuery(ev) {
		ev.preventDefault();
		this.setState({
			searchQuery: ev.target.value,
		});
	}

	submitSearchHandler(ev) {
		ev.preventDefault();
		const {searchQuery} = this.state;
		const {searchRepos} = this.props;

		searchRepos(searchQuery);
	}

	render() {
		const {searchQuery} = this.state;
		const {cancelSearching} = this.props;

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
					onChange={this.changeSearchQuery}
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
	searchRepos: PropTypes.func.isRequired,
};

export default SearchForm;