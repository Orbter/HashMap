class HashMap {
  constructor() {
    this.bucket = new Array(16).fill(null); // Start with an empty list
  }
  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }
    return hashCode;
  }
  set(key, value) {
    if (this.checkLength(this.bucket)) {
      this.revised();
    }
    const elementHash = this.hash(key);
    const placeInArray = elementHash % this.bucket.length;

    if (this.bucket[placeInArray] === null) {
      const newList = new LinkedList();

      newList.append(value, key, elementHash);
      this.bucket[placeInArray] = newList;
    } else {
      const node = this.bucket[placeInArray].findKey(key);
      if (node !== null) {
        node.value = value;
      } else {
        this.bucket[placeInArray].append(value, key, elementHash);
      }
    }
  }
  setRecursion(key, value) {
    const elementHash = this.hash(key);
    const placeInArray = elementHash % this.bucket.length;

    if (this.bucket[placeInArray] === null) {
      const newList = new LinkedList();

      newList.append(value, key, elementHash);
      this.bucket[placeInArray] = newList;
    } else {
      const node = this.bucket[placeInArray].findKey(key);
      if (node !== null) {
        node.value = value;
      }
      this.bucket[placeInArray].append(value, key, elementHash);
    }
  }
  revised() {
    const arrayLength = this.bucket.length;
    const copyArray = this.bucket;
    this.bucket = new Array(arrayLength * 2).fill(null);
    copyArray.forEach((element) => {
      if (element === null) return;
      const size = element.size();
      let current = element.head;
      for (let index = 0; index < size; index++) {
        this.setRecursion(current.key, current.value);
        current = current.nextNode;
      }
    });
  }

  checkLength(array) {
    let count = 0;
    const arrayLength = array.length;
    array.forEach((element) => {
      if (element !== null) count++;
    });
    if (count >= arrayLength * 0.75) {
      return true;
    } else {
      return false;
    }
  }
  get(key) {
    const elementHash = this.hash(key);
    const placeInArray = elementHash % this.bucket.length;
    const answer = this.bucket[placeInArray].findKey(key);
    return answer.value;
  }
  has(key) {
    const elementHash = this.hash(key);
    const placeInArray = elementHash % this.bucket.length;
    const node = this.bucket[placeInArray].findKey(key);
    if (node === null) {
      return false;
    } else {
      return true;
    }
  }
  remove(key) {
    const elementHash = this.hash(key);
    const placeInArray = elementHash % this.bucket.length;
    let answer = false;
    let current = this.bucket[placeInArray].head;

    const size = this.bucket[placeInArray].size();
    if (size === 1) {
      this.bucket[placeInArray] = null;
    } else {
      for (let index = 0; index < size; index++) {
        if (current.hashCode === elementHash) {
          this.bucket[placeInArray].removeAt(index);
          answer = true;
          return answer;
        }
      }
    }

    return answer;
  }
  length() {
    let count = 0;
    this.bucket.forEach((element) => {
      if (element) {
        const size = element.size();
        count += size;
      }
    });
    return count;
  }
  clear() {
    this.bucket = new Array(16).fill(null);
  }
  keys() {
    const newArray = [];
    this.bucket.forEach((element) => {
      if (element === null) {
        return;
      } else {
        const size = element.size();
        let current = element.head;
        for (let index = 0; index < size; index++) {
          newArray.push(current.key);
          current = current.nextNode;
        }
      }
    });
    return newArray;
  }
  values() {
    const newArray = [];
    this.bucket.forEach((element) => {
      if (element === null) {
        return;
      } else {
        const size = element.size();
        let current = element.head;
        for (let index = 0; index < size; index++) {
          newArray.push(current.value);
          current = current.nextNode;
        }
      }
    });
    return newArray;
  }
  entries() {
    const newArray = [];
    this.bucket.forEach((element) => {
      if (element === null) {
        return;
      } else {
        const size = element.size();
        let current = element.head;
        for (let index = 0; index < size; index++) {
          const miniArray = [];
          miniArray.push(current.key, current.value);
          newArray.push(miniArray);
          current = current.nextNode;
        }
      }
    });
    return newArray;
  }
}

class LinkedList {
  constructor() {
    this.head = null; // Start with an empty list
  }
  append(value, key, hashCode) {
    const newNode = new Node(value, key, hashCode);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.nextNode) {
        current = current.nextNode;
      }
      current.nextNode = newNode;
    }
  }
  prepend(value, key, hashCode) {
    const newNode = new Node(value, key, hashCode);
    newNode.nextNode = this.head; // Properly link the new node to the existing head
    this.head = newNode; // Update the head to the new node
  }

  size() {
    let count = 0;
    let current = this.head;

    while (current) {
      count++;
      current = current.nextNode;
    }
    return count;
  }
  getHead() {
    const firstNode = this.head;
    return firstNode;
  }
  tail() {
    if (!this.head) {
      return null;
    } else {
      let current = this.head;
      while (current.nextNode) {
        current = current.nextNode;
      }
      return current;
    }
  }
  at(index) {
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.nextNode;
    }
    return current;
  }
  pop() {
    const size = this.size();
    if (!this.head) return;
    else {
      let current = this.head;
      if (size === 1) {
        this.head = null;
      } else if (size === 2) {
        current.nextNode = null;
      } else {
        for (let index = 0; index < size - 2; index++) {
          current = current.nextNode;
        }
        current.nextNode = null;
      }
    }
  }
  contains(value) {
    let current = this.head;
    while (current.nextNode) {
      if (current.value === value) return true;
      else current = current.nextNode;
    }
    if (current.value === value) return true;
    return false;
  }
  find(value) {
    let answer = null;
    const size = this.size();
    if (!this.head) return answer;
    let current = this.head;
    for (let index = 0; index < size; index++) {
      if (current.value === value) {
        answer = index;
        return answer;
      } else {
        current = current.nextNode;
      }
    }
    return answer;
  }
  findKey(key) {
    let answer = null;
    const size = this.size();
    if (!this.head) return answer;
    let current = this.head;
    for (let index = 0; index < size; index++) {
      if (current.key === key) {
        answer = current;
        return answer;
      } else {
        current = current.nextNode;
      }
    }
    return answer;
  }
  toString() {
    const size = this.size();
    let current = this.head;
    let string;
    while (current) {
      string += `( ${current} ) -> `;
      current = current.nextNode;
    }
    string += `null`;
    console.log(string);
  }
  insertAt(value, index) {
    const newNode = new Node(value);
    const size = this.size();
    if (index === 0) {
      newNode.nextNode = this.head;
      this.head = newNode;
      return;
    }
    let postNode = this.head;
    let current = this.head;
    for (let i = 0; i < index - 1; i++) {
      current = current.nextNode;
    }
    if (current === null) {
      console.log('Error: Index out of bounds');
      return;
    }

    newNode.nextNode = current.nextNode;
    current.nextNode = newNode;
  }
  removeAt(index) {
    if (index === 0) {
      this.head = this.head.nextNode;
      return;
    }
    let current = this.head;
    for (let i = 0; i < index - 1 && current != null; i++) {
      current = current.nextNode;
    }
    if (current === null) {
      console.log('Error: Index out of bounds');
      return;
    }
    if (current.nextNode === null) {
      this.pop();
    }
    current.nextNode = current.nextNode.nextNode;
  }
}

class Node {
  constructor(value, key, hashCode) {
    this.value = value;
    this.nextNode = null;
    this.key = key;
    this.hashCode = hashCode;
  }
}
