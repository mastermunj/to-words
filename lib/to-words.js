'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ToWords = function () {
  function ToWords() {
    _classCallCheck(this, ToWords);

    this.numberWords = [{ number: 10000000, value: 'Crore' }, { number: 100000, value: 'Lakh' }, { number: 1000, value: 'Thousand' }, { number: 100, value: 'Hundred' }, { number: 90, value: 'Ninety' }, { number: 80, value: 'Eighty' }, { number: 70, value: 'Seventy' }, { number: 60, value: 'Sixty' }, { number: 50, value: 'Fifty' }, { number: 40, value: 'Forty' }, { number: 30, value: 'Thirty' }, { number: 20, value: 'Twenty' }, { number: 19, value: 'Nineteen' }, { number: 18, value: 'Eighteen' }, { number: 17, value: 'Seventeen' }, { number: 16, value: 'Sixteen' }, { number: 15, value: 'Fifteen' }, { number: 14, value: 'Fourteen' }, { number: 13, value: 'Thirteen' }, { number: 12, value: 'Twelve' }, { number: 11, value: 'Eleven' }, { number: 10, value: 'Ten' }, { number: 9, value: 'Nine' }, { number: 8, value: 'Eight' }, { number: 7, value: 'Seven' }, { number: 6, value: 'Six' }, { number: 5, value: 'Five' }, { number: 4, value: 'Four' }, { number: 3, value: 'Three' }, { number: 2, value: 'Two' }, { number: 1, value: 'One' }];
  }

  _createClass(ToWords, [{
    key: 'convert',
    value: function convert(number) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options.currency = options.currency === true;

      var ns = number + '';
      if (ns.includes('.')) {
        if ((ns.match(/\./g) || []).length >= 2) {
          throw new Error('Invalid Number `' + number + '`');
        }
        var split = (number + '').split('.');
        return this.convertInternal(split[0], options) + (options.currency ? ' Rupees And ' : ' Point ') + this.convertInternal(split[1], options) + (options.currency ? ' Paise Only' : '');
      }
      return this.convertInternal(number, options) + (options.currency ? ' Rupees Only' : '');
    }
  }, {
    key: 'convertInternal',
    value: function convertInternal(number) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var match = this.numberWords.find(function (elem) {
        return number >= elem.number;
      });

      var words = '';
      if (number >= match.number) {
        if (number <= 100) {
          words += match.value;
          number -= match.number;
          if (number > 0) {
            words += ' ' + this.convertInternal(number, options);
          }
        } else {
          var quotient = Math.floor(number / match.number);
          var remainder = number % match.number;
          if (remainder > 0) {
            return this.convertInternal(quotient, options) + ' ' + match.value + ' ' + this.convertInternal(remainder, options);
          } else {
            return this.convertInternal(quotient, options) + ' ' + match.value;
          }
        }
      }
      return words;
    }
  }]);

  return ToWords;
}();

module.exports = ToWords;
