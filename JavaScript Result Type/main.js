/**
 * @typedef {(
*   [A0, A1] extends [infer T0, infer T1] ? [T0, T1?] :
*   never
* )} Result
* @template A0
* @template A1
*/

function main() {
  let a = process.argv.splice(2)

  let [f, err] = fn(a)
  if (err) {
    console.error("Error:", err.message)
    process.exit(1)
  }

  let t = f()
  console.log(t)
}

/**
 * @param {string[]} a
 * @returns {Result<() => string, Error>}
 */
function fn(a) {
  /**
   * @param {number} n
   * @returns {string}
   */
  let f = (n) => ""

  let s = a[0]

  if (s === "js") {
    f = js
  } else if (s === "ts") {
    f = ts
  } else {
    let e = new Error("The target language must be either 'js' or 'ts'")
    return [f.bind(null, -1), e]
  }

  let n = Number.parseInt(a[1], 10)

  if (Number.isNaN(n)) {
    let e = new Error("The number of arguments must be a number")
    return [f.bind(null, -1), e]
  }

  if (n < 0) {
    let e = new Error("The number of arguments cannot be negative")
    return [f.bind(null, -1), e]
  }

  if (n < 2) {
    let e = new Error("The number of arguments must be at least 2")
    return [f.bind(null, -1), e]
  }

  return [f.bind(null, n)]
}

/**
 * @param {number} n
 * @returns {string}
 */
function js(n) {
  let t = "/**\n * @typedef {(\n"

  let e = ex(n)
  let a = e.split("\n")

  for (let i = 0; i < a.length; i += 1) {
    t += " *   " + a[i] + "\n"
  }

  t = t.slice(0, -1)
  t += "\n * )} Result\n"

  for (let i = 0; i < 2; i += 1) {
    t += " * @template A" + i + "\n"
  }

  for (let i = 2; i < n; i += 1) {
    t += " * @template [A" + i + "=never]\n"
  }

  t += " */"

  return t
}

/**
 * @param {number} n
 * @returns {string}
 */
function ts(n) {
  let t = "type Result<"

  for (let i = 0; i < 2; i += 1) {
    t += "A" + i + ", "
  }

  for (let i = 2; i < n; i += 1) {
    t += "A" + i + " = never, "
  }

  t = t.slice(0, -2)
  t += "> =\n"

  let e = ex(n)
  let a = e.split("\n")

  for (let i = 0; i < a.length; i += 1) {
    t += "  " + a[i] + "\n"
  }

  t = t.slice(0, -1)

  return t
}

/**
 * @param {number} n
 * @return {string}
 */
function ex(n) {
  let t = ""

  for (let i = 0; i < n - 1; i += 1) {
    t += "["

    for (let j = 0; j < n; j += 1) {
      t += "A" + j + ", "
    }

    t = t.slice(0, -2)
    t += "] extends ["

    for (let j = 0; j < 2; j += 1) {
      t += "infer T" + j + ", "
    }

    for (let j = 0; j < i; j += 1) {
      t += "infer T" + (j + 2) + ", "
    }

    for (let j = 2; j < n - i; j += 1) {
      t += "never, "
    }

    t = t.slice(0, -2)
    t += "] ? ["

    for (let j = 0; j < i + 1; j += 1) {
      t += "T" + j + ", "
    }

    t += "T" + (i + 1) + "?] :\n"
  }

  t += "never"

  return t
}

main()
