import * as React from 'react';
import { Component } from 'react';
import { Switch, Route, Link, NavLink } from 'react-router-dom';

export default class App extends Component {
	render() {
		return (
			<main>
				<header>
					<h1><Link to="/">Cards</Link></h1>
				</header>

				<nav>
					<NavLink to="/">Home</NavLink>
					<NavLink to="/about">About</NavLink>
				</nav>

				<Switch>
					<Route exact path="/">
						<article>
							<h1>Home</h1>
						</article>
					</Route>

					<Route path="/about">
						<article>
							<h1>About</h1>
						</article>
					</Route>
				</Switch>

				<footer>©2017 StudyBlue</footer>
			</main>
		);
	}
}
