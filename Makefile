STAGING_SITE = test2.nickpegg.com

all: clean build stage

stage: clean stage_build stage_publish

prod: clean build publish

clean:
	rm -rf build

build:
	posty build

publish:
	rsync -auvP build/ golf:web


stage_build:
	posty build -c config.staging.yml

stage_publish:
	gsutil -m rsync -c -d -r build/ gs://$(STAGING_SITE)
