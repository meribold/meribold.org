.PHONY: _site clean

_site:
	bundle exec jekyll build

clean:
	rm -rf _site
