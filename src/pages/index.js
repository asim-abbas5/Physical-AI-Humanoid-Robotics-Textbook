import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Learning 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: 'Module 1: ROS 2',
      description: 'Master the robotic nervous system - learn ROS 2 fundamentals for building intelligent robotic systems.',
      link: '/docs/module-01-ros2',
    },
    {
      title: 'Module 2: Digital Twin',
      description: 'Create simulated environments and train robots in virtual worlds using Gazebo and digital twins.',
      link: '/docs/module-02-digital-twin',
    },
    {
      title: 'Module 3: NVIDIA Isaac',
      description: 'Explore NVIDIA Isaac Sim for physics-accurate simulation and AI-powered robotics development.',
      link: '/docs/module-03-isaac',
    },
    {
      title: 'Module 4: VLA Models',
      description: 'Discover Vision-Language-Action models that enable robots to understand and interact with the world.',
      link: '/docs/module-04-vla',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className={clsx('col col--6', styles.feature)}>
              <div className="text--center padding-horiz--md">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link
                  className="button button--primary button--sm"
                  to={feature.link}>
                  Explore Module →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="AI-Native Technical Textbook for Physical AI and Humanoid Robotics">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
