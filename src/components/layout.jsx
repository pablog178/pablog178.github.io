import React from 'react';
import { Link } from 'gatsby';

import { rhythm, scale } from '../utils/typography';

const Layout = ({ location, title, children }) => {
	const rootPath = `${__PATH_PREFIX__}/`;
	let header;

	if (location.pathname === rootPath) {
		header = (
			<h1
				style={{
					marginBottom: rhythm(0),
				}}
			>
				<Link to={`/`}>{title}</Link>
			</h1>
		);
	} else {
		header = (
			<h2>
				<Link to={`/`}>{title}</Link>
			</h2>
		);
	}
	return (
		<div
			style={{
				marginLeft: `auto`,
				marginRight: `auto`,
				maxWidth: rhythm(24),
				padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
			}}
		>
			<header>{header}</header>
			<main>{children}</main>
			<footer>
				<p>
					© {new Date().getFullYear()}, Built with
					{` `}
					<a href="https://www.gatsbyjs.org">Gatsby</a>
				</p>
				<p>
					<a href="https://github.com/pablog178/pablog178.github.io">Source</a>
				</p>
			</footer>
		</div>
	);
};

export default Layout;
