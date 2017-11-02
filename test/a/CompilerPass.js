const DI = require('../../src/index');

class CompilerPass extends DI.AbstractCompilerPass
{
    compile (container)
    {
        container.setParameter('root', 'recursive lookups are fun!');
        container.getDefinition('a1').replaceArgument(1, "FOO!");
    }
}

module.exports = CompilerPass;
