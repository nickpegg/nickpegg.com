all: clean build stage

clean:
	rm -rf build

build:
	posty build

stage:
	gsutil -m rsync -c -d -r build/ gs://test2.nickpegg.com

# TODO: add a `publish` task when ready to roll to prod
