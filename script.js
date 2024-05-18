// Tony Sun
// tsun1995@gmail.com

String.prototype.toTitleCase = function () {
  //'use strict'
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i
  var romanNum = /^(i|v|x)$/i
  var alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/
  var wordSeparators = /([ :–—-])/

  //return this.split(wordSeparators);
  return this.split(wordSeparators)
    .map(function (current, index, array) {
      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ':' &&
        // array[index + 1] !== ':' && // title end?
        !(index > 2 && array[index - 2].charAt(array[index - 2].length-1) === '.' && array[index - 2].search(smallWords) == -1) && // if not . at last word
        /* Ignore small words that start a hyphenated phrase */
        (array[index + 1] !== '-' ||
          (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase();
      }
      /* Ignore intentional capitalization */
      if (current.substr(1).search(/[A-Z]|\../) > -1) {
	      // check flag if whole title is upper case then ignore this, manually correct acroymns
        return current;
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current;
      }
    
      if (index == 0 || 
      (index > 3 && array[index - 3] == ':') ||
      (index > 2 && array[index - 2].charAt(array[index - 2].length-1) === '.' && array[index - 2].search(smallWords) == -1) ||
      (current.length === 1 && current.search(romanNum > -1))
      ) {
          /* Capitalize the first letter */
          return current.replace(alphanumericPattern, function (match) {
            return match.toUpperCase()
          })
      }
	  // check for proper nouns here
	  // HERE
      return current.toLowerCase();
    })
    .join('')
}

var items = Zotero.getActiveZoteroPane().getSelectedItems();


for (let i=0; i<items.length; i++) {

const origTitle = items[i].getField('title');

const newTitle = origTitle.toTitleCase();
// return origTitle.toTitleCase(); // COMMENT THIS OUT TO SAVE

items[i].setField('title', newTitle);

await items[i].saveTx();

}
