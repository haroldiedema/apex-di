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

## Example
See [this example](examples/example.js) for a usage example.

## TODO:

Allow loading specific classes (functions) from a required file using the following syntax:
```yaml
services:
    renderer:
        class: !require ['three', 'WebGLRenderer']
```
The above would require the module `three`, then instantiate `WebGLRenderer` from that module.
