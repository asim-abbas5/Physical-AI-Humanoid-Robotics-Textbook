// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'AI-Native Technical Textbook',
  favicon: 'img/favicon.ico',

  // GitHub Pages deployment configuration
  url: 'https://your-username.github.io',
  baseUrl: '/ai-physical-book/',
  organizationName: 'your-username',
  projectName: 'ai-physical-book',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/your-username/ai-physical-book/tree/main/',
          routeBasePath: 'docs',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Physical AI & Humanoid Robotics',
        logo: {
          alt: 'Textbook Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Textbook',
          },
          {
            href: 'https://github.com/your-username/ai-physical-book',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Modules',
            items: [
              {
                label: 'ROS 2',
                to: '/docs/module-01-ros2',
              },
              {
                label: 'Digital Twin',
                to: '/docs/module-02-digital-twin',
              },
              {
                label: 'NVIDIA Isaac',
                to: '/docs/module-03-isaac',
              },
              {
                label: 'VLA',
                to: '/docs/module-04-vla',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/your-username/ai-physical-book',
              },
            ],
          },
        ],
        copyright: `Developer: Asim Abbas | Special Thanks: Sir Zia, Sir Ameen, Sir Qasim, Sir Asharaib, Sir Ali Jawad, Sir Aneeq, and Sir Junaid`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
        additionalLanguages: ['python', 'bash', 'yaml', 'json'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),

  // Build performance optimizations
  // Disabled experimental_faster - requires @docusaurus/faster package
  // future: {
  //   experimental_faster: {
  //     swcJsLoader: true,
  //     swcJsMinimizer: true,
  //     swcHtmlMinimizer: true,
  //     lightningCssMinimizer: true,
  //     rspackBundler: true,
  //     mdxCrossCompilerCache: true,
  //   },
  // },
};

module.exports = config;
