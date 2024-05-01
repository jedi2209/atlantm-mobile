#!/bin/zsh
cd ../../;
export GEM_HOME="$(ruby -e 'puts Gem.user_dir')"
echo 'export PATH="$PATH:$GEM_HOME/bin"' >> ~/.zshrc
source $HOME/.zshrc
bundle update --bundler
# gem install bundler --user-install
echo "===== Installling CocoaPods ====="
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
bundle install
# brew install cocoapods
echo "===== Installing Node.js ====="
brew install node@18
echo 'export PATH="/usr/local/opt/node@18/bin:$PATH"' >> ~/.zshrc
export LDFLAGS="-L/usr/local/opt/node@18/lib"
export CPPFLAGS="-I/usr/local/opt/node@18/include"
source $HOME/.zshrc
echo "===== Installing yarn ====="
brew install yarn

# Install dependencies
echo "===== Running yarn install ====="
yarn install
echo "===== Running pod install ====="
cd ios
pod install
