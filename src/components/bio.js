/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

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
            twitter
          }
        }
      }
    }
  `)

  const styles = {
    main: {
      p: {
        marginBottom: 0,
      },
    },
  }

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        alignItems: `center`,
        marginBottom: rhythm(2.5),
      }}
    >
      <img
        src={`https://avatars3.githubusercontent.com/u/1520866?s=400&u=39be874bc5e8caebe4d387739ea7458fc0b4ec05&v=4`}
        alt={author.name}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          maxWidth: 50,
          borderRadius: `50%`,
        }}
      />
      <div>
        <p style={styles.main.p}>
          Written by <strong>{author.name}</strong> {author.summary}
        </p>
        <p style={styles.main.p}>
          <a href={`https://twitter.com/${social.twitter}`}>I'm on Twitter</a>
        </p>
      </div>
    </div>
  )
}

export default Bio
