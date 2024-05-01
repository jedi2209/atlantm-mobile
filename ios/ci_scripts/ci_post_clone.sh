#!/bin/zsh
echo ">>> INSTALL RVM"
\curl -sSL https://get.rvm.io | bash -s stable --rails
source $HOME/.rvm/scripts/rvm
echo ">>> INSTALL RUBY"
rvm install 3.3.0
echo ">>> SETUP ENVIRONMENT"
source $HOME/.rvm/scripts/rvm
rvm use 3.3.0 --default
echo $(ruby -v)
export GEM_HOME="$(ruby -e 'puts Gem.user_dir')"
echo 'export PATH="$PATH:$GEM_HOME/bin"' >> ~/.zshrc
source $HOME/.zshrc
cd ../../;
echo ">>> INSTALL BUNDLER"
gem install bundler --install-dir $GEM_HOME
echo ">>> INSTALL DEPENDENCIES"
bundle install
echo "===== Installling CocoaPods ====="
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
echo ">>> INSTALL PODS"
bundle exec pod install
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
