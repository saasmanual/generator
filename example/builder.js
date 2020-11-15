import {Generator} from '../src/generator';

(new Generator)
  .source('./content')
  .destination('./out')
  .templates('./templates')
  .build();