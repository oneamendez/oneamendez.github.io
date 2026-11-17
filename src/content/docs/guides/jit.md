---
title: Turning on JIT
description: "Why crate needs JIT to run Linux VMs on iPhone and iPad, and how to turn it on with the built-in StikJIT or with StikDebug."
---

crate translates the guest's code into the iPhone's as it runs, and iOS lets an
app run code it made only while a debugger is attached. JIT is that: crate gets a
debugger to attach for a moment, claims the memory for translated code, and the
debugger leaves. It lasts until crate closes, so it's turned on again each time
crate opens.

Pick the method in **Settings › JIT**.

## Built-in StikJIT (the default)

crate carries [StikJIT](https://github.com/StikDebug/StikJIT) in a helper inside
the app. It needs the iPhone paired with crate and
[LocalDevVPN](https://apps.apple.com/app/localdevvpn/id6755608044) connected;
**Set Up JIT** walks through both. After that, **Turn on JIT when crate opens**
turns it on by itself each time.

## StikDebug

If you already use [StikDebug](https://github.com/StikDebug/StikDebug), pick it
instead: **Turn On JIT** opens StikDebug, which asks you to confirm, attaches,
and brings you back to crate.

## The code region

The code region is the memory set aside for translated code. It's claimed once
per launch, so a change applies the next time crate opens. The default is the
largest, 1024 MB: more room for translated code means less translating again.

## If it doesn't turn on

- The app must be signed with a **development** profile, which allows a debugger
  to attach. `sign-ipa.sh` warns when it isn't.
- For the built-in StikJIT, check that LocalDevVPN is connected, and run Set Up
  JIT again.
- [Export the logs](/crate/guides/logs/): each launch logs its JIT steps.
