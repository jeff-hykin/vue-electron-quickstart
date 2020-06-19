require 'atk_toolbox'

puts <<-HEREDOC

I'll try to install most of these things for you
but be aware your computer will likely have unique errors/challenges

to test you'll need: 
    nodejs ≥ v13.7.0 (exact version is better than a newer version)
    npm ≥ 6.13.6 (exact version is better than a newer version)

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
