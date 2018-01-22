all: clean build stage

clean:
	rm -rf build

build:
	posty build

stage: clean stage_build stage_push

stage_build:
	posty build -c config.staging.yml

stage_push:
	gsutil -m rsync -c -d -r build/ gs://test2.nickpegg.com

# TODO: add a `publish` task when ready to roll to prod
