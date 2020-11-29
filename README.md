# Welcome to Generator

![Unit Tests](https://github.com/saasmanual/generator/workflows/Unit%20Tests/badge.svg?branch=main)

Generator is a simple site generator which is used for [SaaS Manual](https://saasmanual.com).

## Installation

First you need to install the SaaS Manual Generator package:

```
npm install @saasmanual/generator
```

## Usage

Now you can create a new file, say `blog.js` and invoke the generator:

```javascript
import {Generator} from '../src/generator';

(new Generator)
  .source('./content')
  .destination('./out')
  .templates('./templates')
  .build();
```

Make sure you have some Markdown content in the `./content` directory. Also make sure you have a `layout.njk` in the `./templates` directory.
See here for a simple template example https://github.com/saasmanual/generator/blob/main/example/templates/layout.njk

Now you can just run the following command to generate your pages:

```
node -r esm blog.js
```

## Plugins

You can write simple transformers which allows you to generate things like table of contents or anything else really. See the example below:

```javascript
async function plugin(generator) {
  // Do stuff here
}

(new Generator)
  .source('./content')
  .destination('./out')
  .templates('./templates')
  .use(plugin)
  .build();
```
