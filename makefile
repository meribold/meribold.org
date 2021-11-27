.PHONY: _site _min clean push-to-testing push-to-staging push-to-production \
	invalidate-staging invalidate-production

_site:
	rm -rf _site
	bundle exec jekyll build

_min:
	rm -rf _min
	./node_modules/.bin/html-minifier --file-ext html --input-dir _site --output-dir _min \
	   --minify-css --minify-js --collapse-whitespace --remove-comments \
	   --remove-redundant-attributes
	rsync -a --ignore-existing _site/ _min/

clean:
	rm -rf _site _min

push-to-testing: _min
	rclone sync -I --checkers 16 --transfers 16 --progress _min fastmail:testing.meribold.org

push-to-staging: _min
	s3cmd sync --acl-public --delete-removed _min/ s3://staging.meribold.org

push-to-production: _min
	s3cmd sync --acl-public --delete-removed _min/ s3://meribold.org

invalidate-staging:
	aws cloudfront create-invalidation --distribution-id E1S556ZWKNESFX --paths '/*'

invalidate-production:
	aws cloudfront create-invalidation --distribution-id EL6CN1MAOO4HX --paths '/*'
