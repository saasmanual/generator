async function pageHeaders(generator) {
  console.log(generator)
  for (const file in generator.ctx) {
    const props = generator.ctx[file];

    if (!props.data.pageHeaders) {
      props.data.pageHeaders = []
    }

    const matches = props.content.matchAll(/^# (.*)$/gm);
    for (const match of matches) {
      props.data.pageHeaders.push({
        title: match[1]
      });
    }
  }
  return this;
}

export { pageHeaders }