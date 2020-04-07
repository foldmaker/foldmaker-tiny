class f {
  constructor(tokens) {
    let hasTokens = tokens
    this.types = hasTokens ? tokens.map((el) => el.type).join('') : ''
    this.values = hasTokens ? tokens.map((el) => el.value) : []
  }

  parse(...dictionary) {
    dictionary = dictionary.map(([a, b]) => [b, a])
    dictionary.push([() => undefined, /[\s\n\S]/])
    let self = this
    do {
      self = self._replace(self, dictionary)
    } while (self.modified === true)
    return self
  }

  add(string, values) {
    this.types += string
    this.values = this.values.concat(values)
  }

  _replace({ types, values }, dictionary) {
    let state = new f()
    tokenize(types, dictionary, ({ type, map, index }) => {
      let count = map[0].length
      let occurrence = {
        raw: values.slice(index, count + index),
        index, count, map
      }
      let result = type(occurrence)
      if (result) {
        state.add(result[0], [result[1]])
        state.modified = true
      } else {
        state.add(occurrence.map[0], occurrence.raw)
      }      
    })
    return state
  }
}

export let tokenize = (string, dictionary, callback) => {
  let index = 0, tokens = []
  // Add this as the last token by default, this will prevent infinite loops
  dictionary.push(['0', /[\s\n\S]/])
  while (string) {
    dictionary.some(([type, regex]) => {
      let map = regex.exec(string)
      if (map && map.index < 1) {
        // If not found, we are here
        let value = map[0]
        let tokenValue = callback ? callback({ type, value, map, index }) : { type, value }
        if (tokenValue) tokens.push(tokenValue)
        // Advance by slicing the string and push tokens to the list
        string = string.slice(value.length)
        index += value.length
        return true
      }
    })
  }
  return tokens
}

let Foldmaker = (dictionary) => new f(dictionary)
Foldmaker.tokenize = tokenize
export default Foldmaker
