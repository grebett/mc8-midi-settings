# MIDI-Controller MC-8 CLI Updater

__⚠️ Warning! This work is not brought to you nor endorse in any way by [nakedboards](https://nakedboards.org). The following code is provided as is and I decline all responsibility concerning usage of any kind. If you prefer to use the officials tools, you could find them here: https://www.nakedboards.org/mc8.html__

__Thank you for your understanding! 🙇‍♂️__

<img src="https://www.nakedboards.org/slide/images/MIDI-controller.jpg"/>

_nakedboards MC-8, © https://www.nakedboards.org_


## About this project

The [official tool for configurating the nakedboards MC-8](https://www.nakedboards.org/settings_mc-8m.html?) is cool, but somehow limited: you need to be online to set up your faders (or at least download the webpage and serve it locally) and there is no notion of some kind of CCs bank.

To solve this problem, first of all for my own usage, I coded a very simple [Node.js](https://nodejs.org/en/download/) client, whose code you'll find in the present repository.

## Installation
You would of course need some [Node.js](https://nodejs.org/en/download/). Mine was `v14.15.4` when I wrote these lines, and I haven't tested the application with older versions.

First clone the repository, then use for favorite package manager to install the dependencies:

```shell
$ npm install
```
or
```shell
$ yarn install
```

Then populate the `banks.json` file with as many banks as you wish.

They must follow this format:
```
[
    [1, 11],
    [1, 1],
    [2, 11],
    [2, 1],
    [3, 11],
    [3, 1],
    [4, 11],
    [4, 1]
  ],
]
```

...where the first number of the first row is the `MIDI channel` and the `MIDI CC number` for the first fader, and so on...

## Usage

The CLI offers the following command:

```
    -h					Prints this help
    -l	--list			List all banks
    -n	--next			Upload next bank
    -p	--prev			Upload previous bank
    --bank=[number]		Load a specific bank
```

So for instance :

```shell
$ node MC8-MIDI-settings --next
```

... would iterate through the banks in forward.

The settings are immediately uploaded to your nakedboard after a successful command otherwise some error message is displayed in the console.

And that's it!

__Feel free to contact me if you have any question regarding this tool__!

## Licence

Copyright © 2021 grebett

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.