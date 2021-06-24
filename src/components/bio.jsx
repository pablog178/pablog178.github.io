/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

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
		<div>
			<p className="subtitle">
				{author.name}
				<a href={social.github}>
					<img width="20" height="20" src={gh_logo} />
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
			<p className="subtitle">{author.summary}</p>
		</div>
	);
};

export default Bio;
