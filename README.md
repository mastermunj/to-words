# Number to Words

## Introduction

Converts Numbers (including decimal points) into words for Indian style. It also converts the numbers into words for currency, again, for Indian style.

## Installation

```js
npm install to-words --save
```

OR

```js
yarn add to-words
```


## Usage

```js
let toWords = requier('to-words');
let words = toWords(123); // words = One Hundred Twenty Three

words = toWords(123.45); // words = One Hundred Twenty Three Point Fourty Five
```

To convert to currency

```js
let toWords = requier('to-words');
let words = toWords(452); // words = Four Hundred Fifty Two Rupees Only

words = toWords(452.36); // words = Four Hundred Fifty Two Rupee And Thirty Six Paise Only
```
