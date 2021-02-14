// toggle boolean value at position ixpos in array
export function toggleArrayIx (array1, ixpos) {
  let array2 = [...array1];
  array2[ixpos] = !array2[ixpos];
  return array2;
}

// assign value to position ixpos in array, return new array
export function assignArrayIx (array1, ixpos, value) {
  let array2 = [...array1]; 
  array2[ixpos] = value;
  return array2;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function capitalize(ttext) {
  if (ttext.length>0) {
    return ttext.charAt(0).toUpperCase() + ttext.slice(1);
  } else {
    return '';
  }
}
