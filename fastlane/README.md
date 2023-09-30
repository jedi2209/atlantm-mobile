fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios prepare

```sh
[bundle exec] fastlane ios prepare
```

Prepare the iOS app for dev or build

### ios localNoCompile

```sh
[bundle exec] fastlane ios localNoCompile
```

Commit iOS

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Push a new beta build to TestFlight

### ios version

```sh
[bundle exec] fastlane ios version
```

Commit a new iOS version for AppStore

----


## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android internal

```sh
[bundle exec] fastlane android internal
```

Submit a new Internal Build to Google Play

### android version

```sh
[bundle exec] fastlane android version
```

Commit a new version for Google Play

### android ci

```sh
[bundle exec] fastlane android ci
```

CI: submit a new internal build to Google Play

### android release

```sh
[bundle exec] fastlane android release
```

Make a new release build

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
