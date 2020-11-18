# Welcome to Generator

Generator is a simple site generator which is used for the SaaS Manual website.

# Usage

First you need to install the SaaS Manual Generator package:

```
npm install @saasmanual/generator
```

Now you can create a new file, say `blog.js` and invoke the generator:

```
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