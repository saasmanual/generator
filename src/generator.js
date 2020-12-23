import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, dirname, basename } from 'path';
import matter from 'gray-matter'
import merge from 'lodash.merge';
import readdir from 'recursive-readdir';
import nunjucks from 'nunjucks';
import remark from 'remark';
import html from 'remark-html';
import vfile from 'vfile';

function renameFromMdToHtml(file) {
  return `${basename(file, '.md')}.html`;
}

class Generator {
  constructor(dirname = process.cwd()) {
    this.dirname = dirname;
    this.plugins = [];
    this.remarkPlugins = [];
    this.ctx = {};  
    this._source = join(this.dirname, 'src');
    this._templates = join(this.dirname, 'templates');
    this._destination = join(this.dirname, 'out');
  }

  source(src = '') {
    this._source = join(this.dirname, src);
    return this;
  }

  templates(templates = '') {
    this._templates = join(this.dirname, templates);
    return this;
  }

  destination(destination = '') {
    this._destination = join(this.dirname, destination);
    return this;
  }

  use(plugin) {
    if (typeof plugin !== 'function') {
      throw new Error('Please provide a function as the parameter to `use`.');
    }

    this.plugins.push(plugin.bind(this));
    return this;
  }

  useRemarkPlugin(plugin) {
    if (typeof plugin !== 'function') {
      throw new Error('Please provide a function as the parameter to `use`.');
    }

    this.remarkPlugins.push(plugin);
    return this;
  }

  async _readFiles() {
    this.files = await readdir(this._source);
  
    const markdownFiles = this.files.filter((file) => {
      return /.md$/.test(file)
    });
  
    for (const file of markdownFiles) {
      const content = readFileSync(file, 'utf-8');
      const parsedMatter = matter(content);
      
      if (parsedMatter.data.draft && process.env.NODE_ENV === 'production') continue;
      
      const fileName = relative(this._source, file);
      this.ctx[fileName] = parsedMatter;
    }
  }

  async _compileFiles() {
    const rm = remark();
    rm.use(html);

    for (const plugin of this.remarkPlugins) {
      const pluginProps = plugin(this.ctx);
      const func = pluginProps.plugin ? pluginProps.plugin : pluginProps;
      const props = pluginProps.props ? pluginProps.props : {};
      rm.use(func, props);
    }

    for (const file in this.ctx) {
      const props = this.ctx[file];
      const template = join(this._templates, props.data.layout || 'layout.njk');
      
      const data = merge(props.data, {
        content: rm.processSync(vfile({
          contents: props.content,
          path: file,
          basename: basename(file),
          dirname: dirname(file)
        }))
      });

      this.ctx[file].html = nunjucks.render(template, data);
    }
    return this;
  }

  async _writeToDisk() {
    for (const file in this.ctx) {
      const path = dirname(join(this._destination, file));
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
      const out = join(this._destination, dirname(file), renameFromMdToHtml(file));
      writeFileSync(out, this.ctx[file].html);
    }
    return this;
  }

  async _runPlugins() {
    for( const plugin of this.plugins ) {
      await plugin(this)
    }
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
  Generator
}
