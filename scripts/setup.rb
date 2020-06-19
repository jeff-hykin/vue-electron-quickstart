require 'atk_toolbox'

puts <<-HEREDOC

I'll try to install most of these things for you
but be aware your computer will likely have unique errors/challenges

to test you'll need: 
    nodejs ≥ v13.7.0 (exact version is better than a newer version)
    npm ≥ 6.13.6 (exact version is better than a newer version)
 
you'll need emscriptem for WASM
    get asdf, a version manager of many things
    this project uses multpile versions of python at different times

HEREDOC


puts "\nattempting to install node and npm"
if not Console.has_command("npm")
    if OS.is?("mac")
        system "brew install node"
    elsif OS.is?("windows")
        system "scoop install nodejs"
    elsif OS.is?("ubuntu")
        system "sudo apt install nodejs"
    end
end

puts "\n\nattempting to install node modules with `npm install`"
system "npm install"

puts "\n\ninstalling python versions"
system "asdf install python 3.8.2"
system "asdf install python 2.7.14"

puts "\n\nattempting to setup emscriptem"
puts "original instructions here: https://emscripten.org/docs/getting_started/downloads.html"
system "cd emsdk && git pull"
if OS.is?("unix")
    system "asdf local python 3.8.2"
    system "./emsdk install latest"
    system "./emsdk activate latest"
    system "source ./emsdk_env.sh"
    puts "console likely needs to be restarted"
else
    puts "unable to setup for your OS"
end