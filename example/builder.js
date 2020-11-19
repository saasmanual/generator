import { Generator } from '../src/generator';
import { pageHeaders } from './plugin/page-headers'

(new Generator)
  .source('./content')
  .destination('./out')
  .templates('./templates')
  .use(pageHeaders)
  .build();