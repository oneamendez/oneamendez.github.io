---
title: Memory and disk
description: Choosing a VM's memory and disk, and what iOS allows.
---

## Memory

Pick a memory limit of 2, 4, 6, 8, 10 or 12 GB when you install a VM, and change
it later in the VM's settings. A change applies the next time the VM starts.

The VM gets what you picked, or what fits in the memory iOS lets crate use,
whichever is less. **Settings › Memory** shows that limit and what's available
right now.

- **The memory entitlements raise the limit.** Sign crate with Increased Memory
  Limit and Extended Virtual Address Space if your Apple account allows it; see
  [Install](/crate/install/).
- **Smaller can be better on an iPhone.** Memory crate uses for the VM isn't
  there for the desktop's apps. 2 to 4 GB with Xfce leaves the most room for a
  browser.
- **Bigger sizes are for iPads with more memory**, where iOS allows more.

## Disk

You pick the disk's size at install, from 16 GB up, and it can't be changed once
the VM is installed. It's sparse: it takes space on the iPhone only as the VM
writes, plus up to about 512 MB that Linux sets aside as it starts using a disk
that size. If the iPhone fills up first, the VM can't save anything more, so leave
room.
