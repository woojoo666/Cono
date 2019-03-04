async function run_tests() {

	var old_username = username;
	username = 'test';

	// defautl url and tag used for tests
	var url = 'www.test.com';
	var tag = 'test_tag';

	console.log(await addTag(url, tag))

	console.log(await getTags(url));
}
