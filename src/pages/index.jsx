import React from "react"
import { Link, graphql } from "gatsby"
import Image from "gatsby-image"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />

      {posts.map(({ node }) => {
        const {
          excerpt = "",
          fields: { slug = "No title" },
          frontmatter: { date = "", title = "", description = "", media },
          timeToRead = 0,
        } = node || {}

        return (
          <article key={node.fields.slug}>
            <div>
              <header>
                <Link to={slug}>
                  <h3
                    style={{
                      marginBottom: rhythm(0),
                    }}
                  >
                    {title || slug}
                  </h3>
                </Link>
                <p className="date">{date} • Reading time: {timeToRead}m</p>
              </header>
              <section style={{ display: `flex`, alignItems: `center` }}>
                <p
                  style={{}}
                  dangerouslySetInnerHTML={{
                    __html: excerpt,
                  }}
                />
              </section>
            </div>
          </article>
        )
      })}
    </Layout>
  )
}

const postImage = media => {
  if (media) {
    return (
      <Image
        fluid={media.childImageSharp.fluid}
        style={{
          minWidth: `100px`,
          marginLeft: `10px`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
    )
  }

  return ""
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(truncate: false, pruneLength: 200)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            media {
              childImageSharp {
                fluid(maxWidth: 100, quality: 100) {
                  ...GatsbyImageSharpFluid
                  ...GatsbyImageSharpFluidLimitPresentationSize
                }
              }
            }
          }
          timeToRead
        }
      }
    }
  }
`
