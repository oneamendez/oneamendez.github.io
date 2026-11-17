---
title: Logs and bug reports
description: "What crate logs while it runs Linux VMs on iPhone and iPad, how to export the logs, and how to report a bug on GitHub."
---

crate logs what it and the VM engine do, this launch and the last, so a log
survives a crash. Find them in **Settings › Logs**:

- **Collect Logs** turns logging on or off. Off, crate deletes its logs.
- **Track Memory Use** adds the app's memory use every few seconds while a VM
  runs, which helps when iOS closes crate for using too much.
- **Export Logs** shares them, to Files, Mail or anywhere else.

## Reporting a bug

Open an [issue on GitHub](https://github.com/oneamendez/crate-ios/issues) with:

- what you did, what you expected, and what happened;
- the device, its iOS version, and crate's version;
- the VM's distribution and memory size;
- the exported logs, attached.

Look through the logs before you share them: they can hold your VM's name and
the names of its files.
