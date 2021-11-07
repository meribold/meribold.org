.PHONY: _site _min clean deploy

_site:
	rm -rf _site
	bundle exec jekyll build

_min:
	rsync -a --delete _site/ _min/
	./node_modules/.bin/html-minifier --file-ext html --input-dir _min --output-dir _min \
	   --minify-css --minify-js --collapse-whitespace --remove-comments \
	   --remove-redundant-attributes

clean:
	rm -rf _site

deploy: _min
	rclone sync -I --checkers 16 --transfers 16 --progress _min fastmail:meribold.org
	rclone sync -I --checkers 16 --transfers 16 --progress _site fastmail:meribold.org-"$$(date -u +%Y%m%dT%H%M)Z"
