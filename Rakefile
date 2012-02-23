require 'rake/clean'
include ::Rake::DSL

WATCH  = ['**/*.coffee', 'Cakefile'] # ['**/*.coffee', '**/*.haml', '**/*.scss']

desc "Build all HTML, CSS and JavaScript files"
# task :default => (HTML + CSS + JS)
task :default do
  sh 'cake build'
  sh 'jasmine-headless-webkit'
end


desc "Continuously watch for changes and rebuild files"
task :watch => [:default] do
    require 'rubygems'
    require 'fssm'

    def rebuild
        sh 'rake'
    rescue
        nil
    end
    
    begin
        FSSM.monitor(nil, WATCH ) do
            update { rebuild }
            delete { rebuild }
            create { rebuild }
        end
    rescue FSSM::CallbackError => e
        Process.exit
    end

end

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

