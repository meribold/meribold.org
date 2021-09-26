module Jekyll
   class CommitHashGen < Generator
      def generate(site)
         site.config['commit_hash'] = `git rev-parse --short=7 HEAD`
      end
   end
end
