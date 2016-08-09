const tap = require('tap');
const lambda = require('../tmp/lambda/index').default;

tap.test('Function name', test => {
	test.plan(1);

	return lambda({
		events: {
			ok: true
		},
		aws: {
			version: '3'
		}
	})
	.then(result => {
		test.deepEqual(result, {
			ok: true,
			version: '3'
		});
	});
});

tap.test('Error case', test => {
	test.plan(2);

	return lambda({
		events: {
			ok: false
		}
	})
	.catch(error => {
		test.type(error, Error);
		test.match(error.message, /not ok/i);
	});
});
