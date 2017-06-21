import * as React from 'react';
import { Component } from 'react';
import { Switch, Route, Link, NavLink } from 'react-router-dom';
import Lazy from './Lazy';

const Home = Lazy({ loader: () => import('./Home') });
const About = Lazy({ loader: () => import('./About') });

export default class App extends Component {
	render() {
		return (
			<main>
				<header>
					<h1><Link to="/">Holygrail</Link></h1>
				</header>

				<nav>
					<NavLink to="/">Home</NavLink>
					<NavLink to="/about">About</NavLink>
				</nav>

				<Switch>
					<Route exact path="/">
						<Home />
					</Route>

					<Route path="/about">
						<About />
					</Route>
				</Switch>

				<footer>©2017 Jesse Hattabaugh</footer>
			</main>
		);
	}
}
