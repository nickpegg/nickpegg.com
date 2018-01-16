clean:
	rm -r build

build:
	posty build

stage:
	gsutil -m rsync -d -r build/ gs://test.nickpegg.com

# TODO: add a `publish` task when ready to roll to prod
