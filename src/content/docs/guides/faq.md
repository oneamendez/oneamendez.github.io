---
title: FAQ
description: Common questions about crate.
---

## Why isn't crate on the App Store?

crate needs JIT, which iOS gives only to an app a debugger has attached to, and
only apps signed for development can be attached to. The App Store doesn't allow
that, so you sign crate yourself. See [Install](/install/).

## Do I need a Mac?

Yes, to sign and install it: Xcode makes the development profiles, and
`sign-ipa.sh` signs the IPA.

## Do I need a paid Apple developer account?

No. A free account works, but its profiles last 7 days, after which you sign and
install again; your VMs stay. A paid membership's last a year, and can add the
memory entitlements.

## Does it work offline?

Yes. You need the internet to download crate and a VM's image; after that the
VM runs entirely on the device, and your files stay on it. The VM uses the
internet like any computer when it has a connection.

## Is it emulation?

The iPhone and the VM are both arm64, so crate doesn't emulate another kind of
processor. Its engine copies most of the guest's instructions as they are, and
rewrites only what touches the machine. iOS gives apps no hypervisor, so this is
how a VM runs on an iPhone. See [Engine and speed](/engine/).

## Which devices does it run on?

crate is developed on an iPhone Duo with iOS 27.1, and runs on other recent
iPhones and on iPads. The more memory iOS allows crate, the bigger the VM can be:
see [Memory and disk](/guides/memory-and-disk/).

## Can it run Windows or macOS?

Not now. Linux comes first; custom Linux images and other operating systems are
on the [roadmap](/roadmap/).

## How do I report a bug?

[Open an issue](https://github.com/oneamendez/crate-ios/issues) with your
[logs](/guides/logs/).
