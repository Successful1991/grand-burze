const peculiaritySetting = {
  terrace: {
    iconName: 'peculiarity-terrace',
    textKey: 'peculiarity.terrace',
  },
  repair: {
    iconName: 'peculiarity-repair',
    textKey: 'peculiarity.repair',
  },
};

function peculiarity(i18n, options) {
  const html = Object.entries(options)
    .filter((option, value) => value)
    .map(([key]) => {
      if (!peculiaritySetting[key]) return '';
      const { textKey, iconName } = peculiaritySetting[key];
      return `<div class="peculiarity" data-peculiarity-content=${i18n.t(textKey)}>
    <svg class="peculiarity__icon"><use xlink:href="#icon-${iconName}"></use></svg>
  </div>`;
    }).join('');
  return `<div class="peculiarities">${html}</div>`;
}

export default peculiarity;
