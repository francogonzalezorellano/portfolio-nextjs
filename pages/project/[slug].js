import * as React from 'react';
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

import Layout from '../../components/Layout';

const glob = require('glob');

export default function BlogTemplate({ frontmatter, markdownBody, siteTitle }) {
  function reformatDate(fullDate) {
    const date = new Date(fullDate);
    return date.toDateString().slice(4);
  }

  if (!frontmatter) {
    return <></>;
  }

  return (
    <Layout siteTitle={siteTitle}>
      <article>
        <figure>
          <img src={frontmatter.hero_image} alt={`blog_hero_${frontmatter.title}`} />
        </figure>
        <div>
          <h1>{frontmatter.title}</h1>
          <h3>{reformatDate(frontmatter.date)}</h3>
        </div>
        <div>
          <ReactMarkdown source={markdownBody} />
        </div>
        <h2>Written By: {frontmatter.author}</h2>
      </article>
    </Layout>
  );
}

export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params;
  const content = await import(`../../projects/${slug}.md`);
  const config = await import('../../data/config.json');
  const data = matter(content.default);

  return {
    props: {
      siteTitle: config.title,
      frontmatter: data.data,
      markdownBody: data.content
    }
  };
}

export async function getStaticPaths() {
  // get all .md files in the posts dir
  const blogs = glob.sync('posts/**/*.md');

  // remove path and extension to leave filename only
  const blogSlugs = blogs.map(file =>
    file
      .split('/')[1]
      .replace(/ /g, '-')
      .slice(0, -3)
      .trim()
  );

  // create paths with `slug` param
  const paths = blogSlugs.map(slug => `/blog/${slug}`);
  return {
    paths,
    fallback: false
  };
}
