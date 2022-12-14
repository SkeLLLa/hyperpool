const changelog = [
  '@semantic-release/changelog',
  {
    changelogFile: 'docs/CHANGELOG.md',
  },
];

const commitAnalyzer = [
  '@semantic-release/commit-analyzer',
  {
    preset: 'conventionalcommits',
    releaseRules: [
      { breaking: true, release: 'major' },
      { scope: 'release-skip', release: false },
      { type: 'chore', scope: 'release', release: false },
      { scope: 'deps', release: 'patch' },
      { type: 'feat', release: 'minor' },
      { type: 'build', release: 'patch' },
      { type: 'refactor', release: 'patch' },
      { type: 'fix', release: 'patch' },
      { type: 'pref', release: 'patch' },
      { type: 'revert', release: 'patch' },
      { type: 'chore', release: false },
      { type: 'docs', release: false },
      { type: 'style', release: false },
      { type: 'test', release: false },
    ],
  },
];

const git = [
  '@semantic-release/git',
  {
    assets: ['docs', 'package.json'],
  },
];

const github = [
  '@semantic-release/github',
  {
    message: 'chore(release): ${nextRelease.version} \n\n${nextRelease.notes}',
  },
];

const npm = [
  '@semantic-release/npm',
  {
    npmPublish: true,
  },
];

const releaseNotes = [
  '@semantic-release/release-notes-generator',
  {
    preset: 'conventionalcommits',
    writerOpts: {
      groupBy: 'type',
      commitGroupsSort: ['feat', 'fix', 'perf', 'docs', 'revert', 'refactor', 'chore'],
      commitsSort: 'header',
    },
    presetConfig: {
      types: [
        { type: 'build', section: '๐ฆ CI/CD', hidden: true },
        { type: 'chore', section: '๐งพ Other', hidden: false },
        { type: 'ci', section: '๐ฆ CI/CD', hidden: true },
        { type: 'docs', section: '๐ Docs', hidden: false },
        { type: 'example', section: '๐ Examples', hidden: false },
        { type: 'feat', section: '๐ Features', hidden: false },
        { type: 'fix', section: '๐  Fixes', hidden: false },
        { type: 'perf', section: 'โฉ Performance', hidden: false },
        { type: 'refactor', section: 'โ๏ธ Refactor', hidden: false },
        { type: 'revert', section: '๐โ๏ธ Reverts', hidden: false },
        { type: 'style', section: '๐ Style', hidden: true },
        { type: 'test', section: '๐งช Tests', hidden: true },
      ],
    },
  },
];

module.exports = {
  branches: ['master', 'next'],
  plugins: [commitAnalyzer, releaseNotes, changelog, npm, git, github],
};
