import { Validator } from 'jsonschema';
import * as schemas from './schemas/index';
import * as resourcesSchemas from './schemas/resources/index';

const validator = new Validator();

Object.keys(schemas)
    .filter(name => ['resources'].indexOf(name) === -1)
    .forEach(name => {
        validator.addSchema(schemas[name], `/${name}.json`);
        validator.addSchema(schemas[name], `http://panneau.dev/schemas/${name}.json`);
    });

Object.keys(resourcesSchemas).forEach(name => {
    validator.addSchema(resourcesSchemas[name], `/resources/${name}.json`);
    validator.addSchema(resourcesSchemas[name], `http://panneau.dev/schemas/resources/${name}.json`);
});

export default validator;
