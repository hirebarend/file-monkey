<p align="center">
  <a href="https://filemonkey.io"><img src="https://filemonkey.io/icon.png" align="center" width="250" /></a>  
</p>
<p align="center">
  <strong>Simplify file uploads for your application using our File API</strong>
</p>
<p align="center">
  <a href="https://npmjs.com/package/file-monkey"><img src="https://img.shields.io/npm/v/file-monkey.svg" /></a>
  <img src="https://badges.herokuapp.com/browsers?labels=none&googlechrome=latest&firefox=latest&microsoftedge=latest&edge=latest&safari=latest&iphone=latest" />
</p>
<hr/>

## Installation

```sh
npm install file-monkey
```

To get your free API credentials, sign up for a File Monkey account here: [https://filemonkey.io](https://filemonkey.io).

## API Documentation

[https://swagger.filemonkey.io](https://swagger.filemonkey.io)

## Usage

```html
<input id="html-input-element" type="file" />
```

```js
import { FileMonkey } from 'file-monkey';

const fileMonkey = FileMonkey('<username>', '<password>');

const htmlInputElement = document.getElementById("html-input-element");

htmlInputElement.addEventListener("change", function (event) {
    fileMonkey.onChange(event).then((result) => {
      console.log(result);
    });
});
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags](https://github.com/hirebarend/file-monkey/tags) on this repository.

## Contributing

We follow the [conventional commits](https://conventionalcommits.org/) specification to ensure consistent commit messages and changelog formatting.
