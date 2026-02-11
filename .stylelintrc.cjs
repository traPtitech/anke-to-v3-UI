module.exports = {
  customSyntax: 'postcss-html',
  extends: ['stylelint-config-recess-order'],
  rules: {
    'color-hex-length': 'short',
    'color-no-invalid-hex': true,
    'length-zero-no-unit': true,
    'media-feature-name-no-vendor-prefix': true,
    'shorthand-property-no-redundant-values': true,
    // ::v-deepエラー回避
    'selector-pseudo-class-no-unknown': null,
  },
};
