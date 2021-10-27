function infrastructure(i18n, data) {
  return `<div class="s3d-infoBox__row">
      ${i18n.t([`infrastructure.${data.id}`, 'infrastructure.default'])}
    </div>
<button class="s3d__close s3d-infoBox__close" data-s3d-event="closed"></button>`;
}

export default infrastructure;
