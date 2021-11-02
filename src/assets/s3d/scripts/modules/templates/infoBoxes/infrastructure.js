function infrastructure(i18n, data) {
  return `<div class="s3d-infoBox__infrastructure">
  <span class="s3d-infoBox__title">
    ${i18n.t([`infrastructure.${data.id}`, 'infrastructure.default'])}
  </span>
<button class="s3d__close s3d-infoBox__close" data-s3d-event="closed"></button>
</div>`;
}

export default infrastructure;
