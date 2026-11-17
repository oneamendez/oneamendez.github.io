---
title: FAQ
description: "Common questions about crate, the app that runs Linux VMs on iPhone and iPad: why it's not on the App Store, Macs, Apple accounts, offline use and emulation."
---

## Why isn't crate on the App Store?

crate needs JIT, which iOS gives only to an app a debugger has attached to, and
only apps signed for development can be attached to. The App Store doesn't allow
that, so you sign crate yourself. See [Install](/crate/install/).

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

Partly. iOS gives apps no hypervisor, the hardware support VM apps on a Mac use, so
crate's engine runs the guest through a translator instead:

- **Ordinary instructions run as they are.** The VM and the iPhone are both
  arm64, so arithmetic, logic and the like are copied into the translated code
  unchanged and run on the iPhone's CPU at full speed. crate doesn't emulate a
  different kind of processor, as running x86 software on an iPhone would need.
- **What touches the machine is emulated.** Memory accesses, branches, system
  registers and exceptions are rewritten: the engine does in software what the
  guest's memory management and privileged CPU state would do in hardware.
- **The devices are emulated**, as in any VM: the interrupt controller, serial
  port and clock, and the virtio disk, network, GPU, keyboard and tablet.

That emulated part is where the time goes: in the engine's benchmark on a Mac,
crate takes about 2.7 times as long as the same guest on Apple's hypervisor, and
QEMU's translator about 14 times. See [Engine and speed](/crate/engine/).

## Which devices does it run on?

crate is developed on an iPhone Duo with iOS 27.1, and runs on other recent
iPhones and on iPads. The more memory iOS allows crate, the bigger the VM can be:
see [Memory and disk](/crate/guides/memory-and-disk/).

## Can it run Windows or macOS?

Not now. Linux comes first; custom Linux images and other operating systems are
on the [roadmap](/crate/roadmap/).

## How do I report a bug?

[Open an issue](https://github.com/oneamendez/crate-ios/issues) with your
[logs](/crate/guides/logs/).
