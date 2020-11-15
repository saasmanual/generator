import test from 'tape';
import { Generator } from './generator';

test('constructor sets required properties', async (t) => {
  t.plan(3);

  const generator = new Generator('foo');

  t.equal(generator.dirname, 'foo');
  t.equal(generator.plugins.length, 0);
  t.equal(typeof generator.ctx, 'object');
});

test('source sets _source properties', async (t) => {
  t.plan(2);

  const generator = new Generator('foo');

  generator.source('bar');
  t.equal(generator._source, 'foo/bar');

  generator.source();
  t.equal(generator._source, 'foo');
});

test('source returns class instance', async (t) => {
  t.plan(1);

  const generator = new Generator('foo');

  const scope = generator.source('bar');
  t.equal(scope, generator);
});

test('templates sets _templates properties', async (t) => {
  t.plan(2);

  const generator = new Generator('foo');

  generator.templates('bar');
  t.equal(generator._templates, 'foo/bar');

  generator.templates();
  t.equal(generator._templates, 'foo');
});

test('templates returns class instance', async (t) => {
  t.plan(1);

  const generator = new Generator('foo');

  const scope = generator.templates('bar');
  t.equal(scope, generator);
});

test('destination sets _destination properties', async (t) => {
  t.plan(2);

  const generator = new Generator('foo');

  generator.destination('bar');
  t.equal(generator._destination, 'foo/bar');

  generator.destination();
  t.equal(generator._destination, 'foo');
});

test('destination returns class instance', async (t) => {
  t.plan(1);

  const generator = new Generator('foo');

  const scope = generator.destination('bar');
  t.equal(scope, generator);
});

test('use checks if parameter is function', async (t) => {
  t.plan(1);

  const generator = new Generator('foo');

  try {
    generator.use('bar');
  } catch (e) {
    t.equal(e.message, 'Please provide a function as the parameter to `use`.')
  }
});

test('use adds plugin to the plugin stack', async (t) => {
  t.plan(2);

  const generator = new Generator('foo');

  const foo = () => { };

  generator.use(foo);
  t.equal(generator.plugins.length, 1);
  t.equal(generator.plugins[0].name, 'bound foo');
});

test('use returns class instance', async (t) => {
  t.plan(1);

  const generator = new Generator('foo');

  const scope = generator.use(() => { });
  t.equal(scope, generator);
});

test('build returns class instance', async (t) => {
  t.plan(1);

  const generator = new Generator('./example');
  const scope = await generator
    .source('')
    .build();

  t.equal(scope, generator);
});

test('build throws if source directory does not exist', async (t) => {
  t.plan(1);

  const generator = new Generator('foo');

  try {
    await generator.build();
  } catch(e) {
    t.equal(e.message, 'ENOENT: no such file or directory, scandir \'foo/src\'')
  }
});