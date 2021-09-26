.PHONY: _site clean deploy

_site:
	bundle exec jekyll build

clean:
	rm -rf _site

deploy:
	rclone sync -I --checkers 16 --transfers 16 --progress _site fastmail:meribold.org-"$$(date -u +%Y%m%dT%H%M)Z"
	rclone sync -I --checkers 16 --transfers 16 --progress _site fastmail:meribold.org
