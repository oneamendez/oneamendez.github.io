---
title: Known issues
description: What doesn't work yet, and how to get around it.
---

## A guest can't update its own kernel

crate boots a VM's kernel and initrd from outside its disk, so the images hold
their kernel packages at the version they shipped with. A kernel the guest
installs anyway is never booted, and an upgrade can remove the modules the booted
kernel needs.

## Xfce's wallpaper doesn't follow a new screen size

When the desktop changes size, on an external monitor for one, Xfce's panel,
icons and windows follow it, but the wallpaper keeps its old size.

## GNOME may not resize to fit a monitor

If Ubuntu's desktop doesn't fill an external monitor, open Settings › Displays
inside the VM and pick a resolution with the monitor's aspect ratio, such as
1920 × 1080 for a 16:9 monitor.

---

Something else? [Open an issue](https://github.com/oneamendez/crate-ios/issues)
with your [logs](/crate/guides/logs/).
