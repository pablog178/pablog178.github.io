/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { rhythm, scale } from '../utils/typography';

import gh_logo from '../assets/gh.svg';
import tw_logo from '../assets/tw.svg';
import li_logo from '../assets/li.svg';

const Bio = () => {
	const data = useStaticQuery(graphql`
		query BioQuery {
			site {
				siteMetadata {
					author {
						name
						summary
					}
					social {
						github
						linkedin
						twitter
					}
				}
			}
		}
	`);

	const { author, social } = data.site.siteMetadata;
	return (
		<div
			className="author"
			style={{
				marginTop: rhythm(1 / 4),
				marginBottom: rhythm(1),
			}}
		>
			<p
				className="author-name"
				style={{
					...scale(0.3),
					margin: rhythm(0),
				}}
			>
				{author.name}
			</p>
			<p
				className="author-summary"
				style={{
					margin: rhythm(0),
				}}
			>
				{author.summary}
			</p>
			<p className="author-links">
				<a href={social.github}>
					<img className="gh-logo" width="20" height="20" src={gh_logo} />
				</a>
				{'  '}
				<a href={social.twitter}>
					<img width="20" height="20" src={tw_logo} />
				</a>
				{'  '}
				<a href={social.linkedin}>
					<img width="20" height="20" src={li_logo} />
				</a>
			</p>
		</div>
	);
};

export default Bio;
