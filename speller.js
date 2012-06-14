;(function (self, d) {
    (self.loader) || (self.loader = function (s) {
        var newScriptTag = d.createElement('script'),
            firstScriptTag = d.getElementsByTagName('script')[0];

        newScriptTag.src = s;
        newScriptTag.async = true;
        firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag);
    });
})(this, document);

(function (self) {
    (self.speller) || (self.speller = {});
    (self.speller.dic) || (loader('dictionary.js'));
    self.speller.correct = function (word) {
        var candidates = {},
            list = self.speller.edits(word),
            r = word;

        if (!self.speller.dic.hasOwnProperty(word)) {
            list.forEach(function (edit) {
                if (self.speller.dic.hasOwnProperty(edit)) {
                    candidates[self.speller.dic[edit]] = edit;
                }
            });
            if (self.speller.countKeys(candidates) > 0) {
                r = candidates[self.speller.max(candidates)];
            } else {
                list.forEach(function (edit) {
                    self.speller.edits(edit).forEach(function (w) {
                        if (self.speller.dic.hasOwnProperty(w)) {
                            candidates[self.speller.dic[w]] = w;
                        }
                    });
                });
                r = (self.speller.countKeys(candidates) > 0) ?
                        candidates[self.speller.max(candidates)] :
                        word;
            }
        }

        return r;
    };
    self.speller.countKeys = function (o) {
        var attr, r = 0;
        for (attr in o) {
            if (o.hasOwnProperty(attr)) {
                r++;
            }
        }

        return r;
    };
    self.speller.max = function (candidates) {
        var candidate,
            arr = [];

        for (candidate in candidates) {
            if (candidates.hasOwnProperty(candidate)) {
                arr.push(candidate);
            }
        }

        return Math.max.apply(null, arr);
    };
    self.speller.edits = function (word) {
        var letters = 'abcdefghijklmnopqrstuvwxyz'.split(''),
            r = [],
            len = word.length;

        // deletion
        for (var i = 0; i < len; i++) {
            r.push(
                word.slice(0, i) +
                word.slice(i + 1)
            );
        }
        // transposition
        for (var i = 0; i < len-1; i++) {
            r.push(
                word.slice(0, i) +
                word.slice(i + 1, i + 2) +
                word.slice(i, i + 1) +
                word.slice(i + 2)
            );
        }
        // alteration
        for (var i = 0; i < len; i++) {
            letters.forEach(function (l) {
                r.push(
                    word.slice(0, i) +
                    l +
                    word.slice(i + 1)
                );
            });
        }
        // insertion
        for (var i = 0; i <= len; i++) {
            letters.forEach(function (l) {
                r.push(
                    word.slice(0, i) +
                    l +
                    word.slice(i)
                );
            });
        }

        return r;
    };

    return self;
})(this);