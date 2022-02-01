import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';

const TagsPage = ({ data }) => {
  const allTags = data.allMarkdownRemark.group;
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout title={siteTitle}>
      <div>
        <h1>Tags</h1>
          {allTags.nodes}
        <ul>
          {allTags.map(tag => (
            <ul key={tag.fieldValue}>
              {tag.fieldValue}
              {tag.nodes.map(node => 
                  <li><Link to={node.fields.slug}>{node.frontmatter.title}</Link></li>
              )}
            </ul>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default TagsPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;