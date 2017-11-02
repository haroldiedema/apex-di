const DI = require('../src/index');

let container = new DI.Container(),
    loader    = new DI.YamlLoader();

container.load(loader, __dirname + '/test.yml');

let a1 = container.get('a1');

console.log(a1.test());
container.get('foobar');
