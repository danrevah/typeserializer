export function isObject(val: any) {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function isUndefined(val: any) {
  return typeof val === "undefined";
}

// was taken from: https://gist.github.com/TheDistantSea/8021359
export function versionCompare(v1: any, v2: any, options: any = {}) {
  let lexicographical = options && options.lexicographical,
    zeroExtend = options && options.zeroExtend,
    v1parts = v1.split("."),
    v2parts = v2.split(".");

  function isValidPart(x: string) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  /* istanbul ignore next */
  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  /* istanbul ignore next */
  if (zeroExtend) {
    /* istanbul ignore next */
    while (v1parts.length < v2parts.length) v1parts.push("0");
    /* istanbul ignore next */
    while (v2parts.length < v1parts.length) v2parts.push("0");
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  /* istanbul ignore next */
  for (let i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    }

    return v1parts[i] > v2parts[i] ? 1 : -1;
  }

  return v1parts.length === v2parts.length ? 0 : -1;
}
