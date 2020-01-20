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
			needToShowLoader: false,
			resultsPerPage: 30,
			cache: {},
			repos: [],
		};

		this.searchRepos = this.searchRepos.bind(this);
	}

	componentDidMount() {
		this.searchRepos('tetris');
	}

	searchRepos(repoName) {
		const {cache, resultsPerPage} = this.state;

		if (cache[repoName] && cache[repoName].length !== 0) {
			this.setState({
				repos: cache[repoName],
			});
			console.log('from cache', cache[repoName]);
		} else {
			this.setState({
				needToShowLoader: true,
			});
			fetch(`https://api.github.com/search/repositories?q=${repoName}}&sort=stars&order=desc&page=1&per_page=${resultsPerPage}`)
				.then(response => response.json())
				.then(repos => {
					this.setState({
						needToShowLoader: false,
						repos: repos.items,
						cache: {
							...cache,
							[repoName]: repos.items,
						}
					});
					console.log('from response', repos.items[0]);
				});
		}
	}

	cancelSearching() {
		console.log('cancelSearching');
	}

	createReposList() {
		const {repos} = this.state;

		return repos.map((repo) => (
			<div key={repo.id} className={styles['search-page__result']}>
				<a
					className={styles['search-page__name']}
					href={repo.html_url}
					target="_blank"
					rel="noopener noreferrer"
				>{repo.name}</a>
				<span className={styles['search-page__stars']}>{repo.stargazers_count}</span>
			</div>
		));
	}

	render() {
		const {needToShowLoader} = this.state;

		return (
			<main className={styles['search-page']}>
				<h1 className={styles['search-page__header']}>Repositories search</h1>
				<SearchForm
					searchRepos={this.searchRepos}
					cancelSearching={this.cancelSearching}
				/>
				{
					needToShowLoader
						? <Loader />
						: <>
								<h2 className={classNames(styles['search-page__header'], styles['search-page__header_sub'])}>Results</h2>
								<div className={styles['search-page__results']}>
									<div className={classNames(styles['search-page__result'], styles['search-page__result_header'])}>
										<span className={styles['search-page__name']}>Repository name</span>
										<span className={styles['search-page__stars']}>Stars</span>
									</div>
									{this.createReposList()}
								</div>
							</>
				}
				<Paginator />
			</main>
		);
	}
}

export default SearchPage;
