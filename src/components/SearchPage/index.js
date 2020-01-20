import React from 'react';
import classNames from 'classnames';
import Loader from '../Loader/';
import SearchForm from '../SearchForm/';
import Paginator from '../Paginator/';
import styles from './style.module.scss';

class SearchPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: '',
			errorMessage: '',
			isRequestProcessed: false,
			currentPage: 1,
			pagesNumber: 1,
			resultsPerPage: 30,
			cache: {},
			repos: [],
		};

		this.changeSearchQuery = this.changeSearchQuery.bind(this);
		this.cancelSearching = this.cancelSearching.bind(this);
		this.searchRepos = this.searchRepos.bind(this);
	}

	componentDidMount() {
		this.searchRepos();
	}

	componentWillUnmount() {
		if (this.fetchController) {
			this.fetchController.abort();
		}
	}

	changeSearchQuery(newQuery) {
		const {
			searchQuery,
			currentPage,
		} = this.state;

		let changedCurrentPage = currentPage;

		if (newQuery !== searchQuery) {
			changedCurrentPage = 1;
		}

		this.setState({
			searchQuery: newQuery,
			currentPage: changedCurrentPage,
		});
	}

	searchRepos() {
		const {
			cache,
			currentPage,
			resultsPerPage,
			searchQuery,
		} = this.state;

		if (searchQuery === '') {
			this.setState({
				repos: [],
				pagesNumber: 1,
				errorMessage: '',
			});
			return;
		}

		if (
			cache[searchQuery]
			&& cache[searchQuery][currentPage]
			&& cache[searchQuery][currentPage].length !== 0
		) {
			this.setState({
				repos: cache[searchQuery][currentPage],
				pagesNumber: cache[searchQuery].pagesNumber,
				errorMessage: '',
			});
		} else {
			this.setState({
				isRequestProcessed: true,
			});

			this.fetchController = new AbortController();
			this.fetchSignal = this.fetchController.signal;

			fetch(
				`https://api.github.com/search/repositories?q=${searchQuery}}&sort=stars&order=desc&page=${currentPage}&per_page=${resultsPerPage}`,
				{signal: this.fetchSignal},
				)
				.then(response => {
					if (response.ok) {
						return response.json()
					} else {
						return null;
					}
				})
				.then(repos => {
					if (repos === null) {
						this.setState({
							isRequestProcessed: false,
							errorMessage: 'Something went wrong. Please wait few seconds before another search.',
						});
						return;
					}
					const {total_count} = repos;
					const pagesNumber = Math.ceil(total_count / resultsPerPage);

					this.setState({
						isRequestProcessed: false,
						errorMessage: '',
						currentPage,
						pagesNumber,
						repos: repos.items,
						cache: {
							...cache,
							[searchQuery]: {
								...cache[searchQuery],
								pagesNumber: pagesNumber,
								[currentPage]: repos.items,
							},
						}
					});
				})
				.catch((err) => {
					console.log('ERROR', err);
					this.setState({
						isRequestProcessed: false,
						errorMessage: `${err.name === 'AbortError' ? 'Searching was cancelled.' : 'Something went wrong.'}`,
					});
				});
		}
	}

	paginatorClickHandler(prevOrNext) {
		const {
			currentPage,
		} = this.state;
		let changedCurrentPage = prevOrNext === 'prev' ? currentPage - 1 : currentPage + 1;

		this.setState({
			currentPage: changedCurrentPage,
		}, () => {
			this.searchRepos();
		});
	}

	cancelSearching() {
		if (this.fetchController) {
			this.fetchController.abort();
		}
	}

	createReposList() {
		const {repos, errorMessage} = this.state;

		if (errorMessage) {
			return (
				<div className={styles['search-page__no-result']}>{errorMessage}</div>
			);
		}

		return (<>
			{
				(repos.length === 0)
					? <div className={styles['search-page__no-result']}>There are no repositories</div>
					: <>
							<div className={classNames(styles['search-page__result'], styles['search-page__result_header'])}>
								<span className={styles['search-page__name']}>Repository name</span>
								<span className={styles['search-page__stars']}>Stars</span>
							</div>
							{repos.map((repo) => (
								<div key={repo.id} className={styles['search-page__result']}>
									<a
										className={styles['search-page__name']}
										href={repo.html_url}
										target="_blank"
										rel="noopener noreferrer"
									>{repo.name}</a>
									<span className={styles['search-page__stars']}>{repo.stargazers_count}</span>
								</div>
							))}
						</>
			}
			</>);
	}

	render() {
		const {
			currentPage,
			isRequestProcessed,
			pagesNumber,
			repos,
			searchQuery,
		} = this.state;

		return (
			<main className={styles['search-page']}>
				<h1 className={styles['search-page__header']}>Repositories search</h1>
				<SearchForm
					searchQuery={searchQuery}
					searchRepos={this.searchRepos}
					changeSearchQuery={this.changeSearchQuery}
					cancelSearching={this.cancelSearching}
				/>
				<h2 className={classNames(styles['search-page__header'], styles['search-page__header_sub'])}>Results</h2>
				{!!repos && !!repos.length && <Paginator
					currentPage={currentPage}
					pagesNumber={pagesNumber}
					previousClickHandler={this.paginatorClickHandler.bind(this, 'prev')}
					nextClickHandler={this.paginatorClickHandler.bind(this, 'next')}
				/>}
				{isRequestProcessed
					? <Loader />
					: <div className={styles['search-page__results']}>
							{this.createReposList()}
						</div>}
			</main>
		);
	}
}

export default SearchPage;
