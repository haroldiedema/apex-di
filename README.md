Apex: Dependency Injection Component
====================================
> (!) work in progress.

This package adds the inversion of control (IoC) code pattern to your project.

## Installation

Using yarn
```bash
$ yarn add apex-di
```

or npm
```bash
$ npm install apex-di --save
```

## Configuration

Apex DI uses the YAML syntax to configure the service container.

Example:
```yaml
# myapp/container.yml
imports:
    - "config/parameters.yml"
    - "config/services.yml"

compiler_passes:
    - "src/CompilerPass"

parameters:
    foo: "foo"
    bar: "bar"
    root: "/%foo%/%bar%"        # /foo/bar
    path: "%root%/more/paths"   # /foo/bar/more/paths
    
services:
    my_service:
        class: !require "src/MyService"
        arguments:
            - "%path%/%morepath%"
            - "@my_jquery_service"


# myapp/config/parameters.yml
parameters:
    morepath: "/foo"
    
# myapp/config/services.yml
services:
        my_jquery_service:
            class: !require "jquery"
```

Usage:
```js
// myapp/index.js
const DI = require('apex-di');

const container = new DI.Container(),
      loader    = new DI.YamlLoader();

container.load(loader, 'container.yml');

container.getParameter('morepath'); // # /foo/bar/foo
container.get('my_service'); // # instance of src/MyService 
```


### TODO:

Allow loading specific classes (functions) from a required file using the following syntax:
```yaml
services:
    renderer:
        class: !require ['three', 'WebGLRenderer']
```
The above would require the module `three`, then instantiate `WebGLRenderer` from that module.
