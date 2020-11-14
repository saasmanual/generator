import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, dirname, basename } from 'path';
import matter from 'gray-matter'
import merge from 'lodash.merge';
import readdir from 'recursive-readdir';
import nunjucks from 'nunjucks';
import remark from 'remark';
import html from 'remark-html';

function renameFromMdToHtml(file) {
  return `${basename(file, '.md')}.html`;
}

class Generator {
  constructor(dirname = process.cwd()) {
    this.dirname = dirname;
    this.plugins = [];
    this.ctx = {};  
  }

  source(src = '') {
    this._source = join(this.dirname, src);
    return this;
  }

  templates(templates = '') {
    this._templates = join(this.dirname, templates);
    return this;
  }

  destination(destination) {
    this.destination = join(this.dirname, destination);
    return this;
  }

  use(plugin) {
    this.plugins.push(plugin.bind(this));
    return this;
  }

  async _readFiles() {
    this.files = await readdir(this._source);
  
    const markdownFiles = this.files.filter((file) => {
      return /.md$/.test(file)
    });
  
    for (const file of markdownFiles) {
      const content = readFileSync(file, 'utf-8');
      const data = matter(content);
      const fileName = relative(this._source, file);
      this.ctx[fileName] = data;
    }
  }

  async _compileFiles() {
    for (const file in this.ctx) {
      const props = this.ctx[file];
      const template = join(this._templates, props.data.layout || 'layout.njk');
      const data = merge(props.data, {
        content: remark().use(html).processSync(props.content)
      });
      this.ctx[file].html = nunjucks.render(template, data);
    }
    return this;
  }

  async _writeToDisk() {
    for (const file in this.ctx) {
      const path = dirname(join(this.destination, file));
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
      const out = join(this.destination, dirname(file), renameFromMdToHtml(file));
      writeFileSync(out, this.ctx[file].html);
    }
    return this;
  }

  async _runPlugins() {
    // Sorry for the below, there seems no other way to execute async functions serially.
    // We could add some dependency but this is just the easiest way it appears.
    // Please only change if you don't exchange for some external dependency.
    await this.plugins.reduce(async (previousPromise, nextAsyncFunction) => {
      await previousPromise;
      await nextAsyncFunction(this);
    }, Promise.resolve());
  }

  async build(src) {
    await this._readFiles();
    await this._runPlugins();
    await this._compileFiles();
    await this._writeToDisk();
    return this;
  }
}

export {
  Generator as default
}