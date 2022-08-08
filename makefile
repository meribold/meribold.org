.PHONY: _site/testing _site/staging _site/production _min/testing _min/staging \
   _min/production clean push-to-testing push-to-staging push-to-production \
   invalidate-staging invalidate-production

_site/testing _site/staging _site/production: _site/%:
	rm -rf $@
	JEKYLL_ENV=$* bundle exec jekyll build --config _config.yml,_$*.yml --destination $@

_min/testing _min/staging _min/production: _min/%: _site/%
	rm -rf $@
	./node_modules/.bin/html-minifier --file-ext html --input-dir $< --output-dir $@ \
	   --minify-css --minify-js --collapse-whitespace --remove-comments \
	   --remove-redundant-attributes
	rsync -a --ignore-existing $</ $@/

clean:
	rm -rf _site _min

push-to-testing: _min/testing
	rclone sync -I --exclude '*.pdf' --checkers 16 --transfers 16 --progress $< fastmail:testing.meribold.org

push-to-staging: _min/staging
	s3cmd sync --acl-public --delete-removed $</ s3://staging.meribold.org

push-to-production: _min/production
	s3cmd sync --acl-public --delete-removed $</ s3://meribold.org

invalidate-staging:
	aws cloudfront create-invalidation --distribution-id E1S556ZWKNESFX --paths '/*'

invalidate-production:
	aws cloudfront create-invalidation --distribution-id EL6CN1MAOO4HX --paths '/*'
