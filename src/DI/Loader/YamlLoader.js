/* APEX; Dependency Injection Component            _______
 *                                                 ___    |________________  __
 * Copyright 2017, Harold Iedema                   __  /| |__  __ \  _ \_  |/_/
 * <harold@iedema.me>                              _  ___ |_  /_/ /  __/_>  <
 * Licensed under MIT.                             /_/  |_|  .___/\___//_/|_|
 * ----------------------------------------------------- /_*/
'use strict';

const fs             = require('fs'),
      path           = require('path'),
      YAML           = require('js-yaml'),
      AbstractLoader = require('../AbstractLoader'),
      Definition     = require('../Definition');

/**
 * Loads YAML files into the service container.
 */
class YamlLoader extends AbstractLoader
{
    constructor ()
    {
        super();
        this._schema = YAML.Schema.create(this._createSchema());
    }

    /**
     * Loads the given YAML file into the container.
     *
     * @param container
     * @param file
     */
    load (container, file)
    {
        let path_info = path.parse(file);

        // Add the directory of the given file to the module paths lookup list. This way, relative imports of node-
        // modules are possible from the location of the YAML file.
        module.paths.unshift(path_info.dir);

        // Load the YAML data as an object.
        let data = YAML.load(fs.readFileSync(file), {schema: this._schema});

        // Remove the module path from the list after we're done reading.
        if (module.paths.shift() !== path_info.dir) {
            throw new Error('Integrity of module lookup paths has been compromised while loading YAML "' + file + '".');
        }

        // Process the data.
        this._parse(container, path_info, data);
    }

    /**
     * Parses the given data.
     *
     * @private
     * @param {Container} container
     * @param {Object}    path_info
     * @param {Object}    data
     */
    _parse (container, path_info, data)
    {
        if (typeof data !== 'object') {
            throw new Error('Unable to parse file: "' + path_info.base + '".');
        }

        if (typeof data.parameters === 'object') {
            this._parseParameters(container, data.parameters);
        }
        if (typeof data.services === 'object') {
            this._parseServices(container, data.services);
        }
        if (typeof data.imports === 'object') {
            this._parseImports(container, path_info, data.imports);
        }
        if (typeof data.compiler_passes === 'object') {
            this._parseCompilerPasses(container, data.compiler_passes);
        }
    }

    /**
     * @private
     * @param {Container} container
     * @param {Object}    parameters
     */
    _parseParameters (container, parameters)
    {
        Object.keys(parameters).forEach((name) => {
            container.setParameter(name, parameters[name]);
        });
    }

    /**
     * @private
     * @param {Container} container
     * @param {Object}    services
     */
    _parseServices (container, services)
    {
        let definition;
        Object.keys(services).forEach((id) => {
            definition = new Definition(services[id]['class'], services[id]['arguments'] || []);

            // Add method calls.
            (services[id].calls || []).forEach((call) => {
                definition.addMethodCall(call[0], call[1] || []);
            });

            // Add tags
            (services[id].tags || []).forEach((tag) => {
                definition.addTag(tag);
            });

            // Add properties.
            Object.keys((services[id].properties || {})).forEach((name) => {
                definition.setProperty(name, services[id][name]);
            });

            container.setDefinition(id, definition);
        });
    }

    /**
     * @private
     * @param {Container} container
     * @param {Object}    path_info
     * @param {Object}    imports
     */
    _parseImports (container, path_info, imports)
    {
        imports.forEach((file) => {
            file = path.join(path_info.dir, file);
            this.load(container, file);
        });
    }

    _parseCompilerPasses (container, passes)
    {
        passes.forEach((pass) => { container.addCompilerPass(pass); });
    }

    /**
     * @private
     * @returns {Array}
     */
    _createSchema ()
    {
        return [
            new YAML.Type('!require', {
                kind:      'scalar',
                construct: (data) => {
                    return require(data);
                }
            })
        ];
    }
}

module.exports = YamlLoader;