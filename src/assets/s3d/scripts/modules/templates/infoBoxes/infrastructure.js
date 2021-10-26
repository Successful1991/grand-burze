function infrastructure(i18n, data) {
  console.log(data);
  return `<div class="s3d-infoBox__row">
      ${i18n.t([`infrastructure.${data.id}`, 'infrastructure.default'])}
    </div>`;
}

export default infrastructure;
