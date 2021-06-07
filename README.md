## Getting Started

Follow these instructions for set up your project

### Prerequisites

After cloning repo  install all dependencies:


```bash
npm install

npx electron-rebuild
```
### Running project

After dependencies installed execute command:

```bash
npm run start

```

### Package:
```bash
npm run package
```
Copy ref-napi and ffi-napi to out/Cryptowallet/node_modules

Also copy lib32.dll into resources

Then
```bash
npm run make-release
```
for make squirrel installer