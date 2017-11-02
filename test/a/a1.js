module.exports = function (a, b) {

    console.log('INIT:', a, b);

    return {
        test: function () {
            return a + b;
        },

        add: function (a, b) {
            return a + b;
        },

        hello: function (a, b) {
            console.log(a, ' -- ', b);
        }
    };

};