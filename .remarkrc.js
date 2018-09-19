const fs = require('fs');
const path = require('path');

exports.settings = {};

const personalDictionaryPath = path.join(__dirname, '.dictionary')
const personalDictionary = fs.existsSync(personalDictionaryPath) ? {
  personal: fs.readFileSync(personalDictionaryPath, 'utf8')
} : {}

exports.plugins = [
  require('remark-preset-lint-consistent'),
  require('remark-preset-lint-recommended'),
  require('remark-preset-lint-markdown-style-guide'),
  [require('remark-lint-unordered-list-marker-style'), 'consistent'],
  require('remark-lint-no-dead-urls'),
  require('remark-lint-heading-whitespace'),
  [require('remark-lint-write-good'), ["warn", {
    "passive": true,
    "illusion": true,
    "so": true,
    "thereIs": true,
    "weasel": true,
    "adverb": true,
    "tooWordy": true,
    "cliches": true,
    "eprime": false
  }]],
  require('remark-validate-links'),
  require('remark-frontmatter'),
  [
    require('remark-retext'),
    require('unified')().use({
      plugins: [
        require('retext-english'),
        require('retext-syntax-urls'),
        [
          require('retext-spell'),
          {
            ignoreLiteral: true,
            dictionary: require('dictionary-en-us'),
            ...personalDictionary
          },
        ],
        [require('retext-sentence-spacing'), {
          preferred: 1
        }],
        require('retext-repeated-words'),
        require('retext-usage'),
        require('retext-indefinite-article'),
        require('retext-redundant-acronyms'),
        [
          require('retext-contractions'),
          {
            straight: true,
            allowLiteral: true
          },
        ],
        require('retext-diacritics'),
        [require('retext-quotes'), {
          preferred: 'straight'
        }],
        require('retext-equality'),
        require('retext-overuse'),
        require('retext-passive'),
        require('retext-profanities'),
        [require('retext-readability'), {
          age: 20
        }]
      ]
    })
  ]
];