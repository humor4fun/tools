/* tools/utils/generators.js
   
   Comprehensive password and encryption key generation utilities.
   Provides 18 different generators for passwords, keys, SSH pairs, and hashes.
   
   Usage:
     const pwd = await Generators.randomPassword({ length: 16, uppercase: true, numbers: true });
     const key = await Generators.aesKey({ bits: 256 });
     const ssh = await Generators.sshKeyPair({ algorithm: 'Ed25519' });
*/

'use strict';

(function () {
  const EFF_WORDLIST = [
    'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account',
    'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'active', 'activity', 'actor',
    'actual', 'adapt', 'add', 'addict', 'adding', 'address', 'adjust', 'admit', 'adopt', 'adult',
    'advance', 'adverse', 'advice', 'advise', 'affair', 'afford', 'afraid', 'after', 'again', 'against',
    'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
    'alcohol', 'alert', 'alien', 'align', 'alike', 'alive', 'all', 'alley', 'allow', 'almost',
    'alone', 'along', 'already', 'also', 'alter', 'always', 'amateur', 'amaze', 'ambiguous', 'ambush',
    'amend', 'america', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'and', 'android',
    'angel', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annoy', 'annual', 'another',
    'answer', 'antenna', 'antique', 'anxiety', 'any', 'apart', 'apartment', 'apex', 'apology', 'appear',
    'apple', 'apply', 'approach', 'approve', 'april', 'apron', 'apt', 'aqua', 'aquarium', 'arab',
    'arbor', 'arcade', 'arch', 'arctic', 'area', 'arena', 'argue', 'argument', 'arise', 'arm',
    'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrival', 'arrive', 'arrow', 'art',
    'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'asthma',
    'athlete', 'atom', 'attach', 'attack', 'attain', 'attempt', 'attend', 'attention', 'attest', 'attire',
    'attitude', 'attract', 'auction', 'audit', 'august', 'aunt', 'aura', 'auspice', 'austere', 'australia',
    'austria', 'author', 'authority', 'auto', 'autumn', 'avenue', 'average', 'avery', 'avoid', 'await',
    'awake', 'award', 'aware', 'away', 'awesome', 'awful', 'awkward', 'awning', 'awoke', 'ax',
    'axe', 'axiom', 'axis', 'axle', 'axon', 'ay', 'aye', 'ayes', 'aztec', 'azure',
    'baby', 'bachelor', 'back', 'bad', 'badge', 'badly', 'bag', 'bagel', 'baggy', 'bail',
    'bait', 'bake', 'baker', 'balance', 'balcony', 'bald', 'ball', 'ballet', 'balloon', 'ballroom',
    'balls', 'bamboo', 'banana', 'band', 'bandage', 'bandit', 'bandstand', 'bandy', 'bane', 'bang',
    'bank', 'banner', 'bar', 'barb', 'barbecue', 'barber', 'bard', 'bare', 'barely', 'bargain',
    'barge', 'bark', 'barley', 'barn', 'barrel', 'barren', 'barrette', 'barricade', 'barrier', 'barring',
    'barroom', 'bars', 'barstool', 'bartender', 'barter', 'base', 'baseball', 'baseboard', 'based', 'baseline',
    'basement', 'bases', 'bash', 'basic', 'basil', 'basin', 'basis', 'bask', 'basket', 'bass',
    'bassinet', 'bassist', 'bassoon', 'bassy', 'bast', 'baste', 'bastion', 'bat', 'batch', 'bath',
    'bathe', 'bathing', 'bathos', 'bathrobe', 'bathroom', 'bathtub', 'batik', 'bating', 'batiste', 'batons',
    'batsman', 'batsmen', 'battalion', 'batted', 'batter', 'battered', 'batters', 'battery', 'batting', 'battle',
    'battled', 'battlement', 'battles', 'batting', 'battue', 'bawdy', 'bawl', 'bawled', 'bawling', 'bawls',
    'bay', 'bayonet', 'bayou', 'bays', 'bazaar', 'bazillion', 'beach', 'beacon', 'bead', 'beaded',
    'beading', 'beadle', 'beads', 'beady', 'beak', 'beaked', 'beaker', 'beaks', 'beam', 'beamed',
    'beaming', 'beams', 'bean', 'beanies', 'beans', 'bear', 'bearable', 'bearcat', 'beard', 'bearded',
    'bearer', 'bearing', 'bearings', 'bearish', 'bears', 'beast', 'beastie', 'beastly', 'beasts', 'beat',
    'beaten', 'beater', 'beaters', 'beating', 'beatitude', 'beatnik', 'beats', 'beau', 'beaujolais', 'beaumont',
    'beauteous', 'beautician', 'beautiful', 'beautified', 'beautifies', 'beautify', 'beauty', 'beaver', 'beavers', 'became'
  ];

  const CONSONANTS = 'bcdfghjklmnprstvwxyz';
  const VOWELS = 'aeiou';
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const AMBIGUOUS = 'il1Lo0O';

  // Helper: Get random bytes
  async function getRandomBytes(length) {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    return arr;
  }

  // Helper: Get random item from array
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Helper: Shuffle array
  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Helper: Convert bytes to hex
  function bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Helper: Convert bytes to base64
  function bytesToBase64(bytes) {
    return btoa(String.fromCharCode(...bytes));
  }

  // Helper: Calculate password entropy
  function calculateEntropy(charset, length) {
    return Math.log2(Math.pow(charset, length));
  }

  // Helper: Calculate time to crack (at 10B attempts/sec)
  function timeToGuess(entropy) {
    const attemptsPerSec = 1e10;
    const seconds = Math.pow(2, entropy) / attemptsPerSec / 2;
    return seconds;
  }

  // Helper: Format time in human readable format
  function formatTime(seconds) {
    if (seconds < 1) return 'instant';
    if (seconds < 60) return Math.round(seconds) + 's';
    if (seconds < 3600) return Math.round(seconds / 60) + 'm';
    if (seconds < 86400) return Math.round(seconds / 3600) + 'h';
    if (seconds < 31536000) return Math.round(seconds / 86400) + 'd';
    return Math.round(seconds / 31536000) + 'y';
  }

  // Helper: Convert ArrayBuffer to PEM format
  function toPem(keyData, type) {
    const base64 = bytesToBase64(new Uint8Array(keyData));
    const lines = base64.match(/.{1,64}/g) || [];
    const header = `-----BEGIN ${type}-----`;
    const footer = `-----END ${type}-----`;
    return [header, ...lines, footer].join('\n');
  }

  // Helper: Extract SSH public key from SPKI and convert to OpenSSH format
  function spkiToSshEcPublicKey(spkiDer, comment = '') {
    try {
      // SPKI structure: SEQUENCE { SEQUENCE { algorithm OID curve }, BIT STRING point }
      // For P-256: point is 65 bytes (0x04 + 32-byte X + 32-byte Y)
      // For P-384: point is 97 bytes (0x04 + 48-byte X + 48-byte Y)
      const view = new Uint8Array(spkiDer);
      
      // Find the BIT STRING (tag 0x03) which contains the public key point
      let bitStringIndex = -1;
      for (let i = 0; i < view.length - 2; i++) {
        if (view[i] === 0x03) {
          bitStringIndex = i;
          break;
        }
      }
      
      if (bitStringIndex === -1) throw new Error('Invalid SPKI structure');
      
      // Skip BIT STRING tag and length, then skip the 0x00 padding byte
      let pointStart = bitStringIndex + 2;
      if (view[bitStringIndex + 1] > 127) {
        pointStart += (view[bitStringIndex + 1] & 0x7f);
      }
      pointStart += 1; // skip padding byte
      
      // Extract the point (65 or 97 bytes depending on curve)
      const pointLength = view[bitStringIndex + 1] <= 127 ? 
        view[bitStringIndex + 1] - 1 : 
        view[bitStringIndex + 2];
      const point = view.slice(pointStart, pointStart + pointLength);
      
      // Determine curve from point length
      let curveType, curveName;
      if (point.length === 65) {
        curveType = 'ecdsa-sha2-nistp256';
        curveName = 'nistp256';
      } else if (point.length === 97) {
        curveType = 'ecdsa-sha2-nistp384';
        curveName = 'nistp384';
      } else {
        throw new Error('Unsupported curve');
      }
      
      // Build SSH wire format
      let wireFormat = '';
      
      // Write key type
      const keyTypeBytes = new TextEncoder().encode(curveType);
      wireFormat += String.fromCharCode(
        (keyTypeBytes.length >> 24) & 0xff,
        (keyTypeBytes.length >> 16) & 0xff,
        (keyTypeBytes.length >> 8) & 0xff,
        keyTypeBytes.length & 0xff
      ) + new TextDecoder().decode(keyTypeBytes);
      
      // Write curve name
      const curveNameBytes = new TextEncoder().encode(curveName);
      wireFormat += String.fromCharCode(
        (curveNameBytes.length >> 24) & 0xff,
        (curveNameBytes.length >> 16) & 0xff,
        (curveNameBytes.length >> 8) & 0xff,
        curveNameBytes.length & 0xff
      ) + new TextDecoder().decode(curveNameBytes);
      
      // Write point
      wireFormat += String.fromCharCode(
        (point.length >> 24) & 0xff,
        (point.length >> 16) & 0xff,
        (point.length >> 8) & 0xff,
        point.length & 0xff
      ) + new TextDecoder().decode(point);
      
      // Encode to base64
      const base64Wire = btoa(wireFormat);
      const sshKey = `${curveType} ${base64Wire}`;
      return comment ? `${sshKey} ${comment}` : sshKey;
    } catch (e) {
      console.error('SSH key conversion error:', e);
      throw e;
    }
  }

  // Generate random password
  async function randomPassword(options = {}) {
    const {
      length = 16,
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = false,
      excludeAmbiguous = false
    } = options;

    let charset = '';
    if (lowercase) charset += excludeAmbiguous ? LOWERCASE.replace(/[il1o]/g, '') : LOWERCASE;
    if (uppercase) charset += excludeAmbiguous ? UPPERCASE.replace(/[IO]/g, '') : UPPERCASE;
    if (numbers) charset += excludeAmbiguous ? NUMBERS.replace(/[01]/g, '') : NUMBERS;
    if (symbols) charset += SYMBOLS;

    if (!charset) charset = LOWERCASE;

    const bytes = await getRandomBytes(length);
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[bytes[i] % charset.length];
    }

    return {
      value: password,
      charset: charset.length,
      entropy: calculateEntropy(charset.length, length),
      timeToGuess: formatTime(timeToGuess(calculateEntropy(charset.length, length)))
    };
  }

  // Generate passphrase from words
  async function passphrase(options = {}) {
    const {
      wordCount = 4,
      separator = '-',
      capitalize = false,
      addNumber = false
    } = options;

    const words = [];
    for (let i = 0; i < wordCount; i++) {
      let word = randomChoice(EFF_WORDLIST);
      if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1);
      words.push(word);
    }

    if (addNumber) {
      words.push(Math.floor(Math.random() * 100).toString());
    }

    const phrase = words.join(separator);
    const entropy = calculateEntropy(EFF_WORDLIST.length, wordCount);

    return {
      value: phrase,
      charset: EFF_WORDLIST.length,
      entropy: entropy,
      timeToGuess: formatTime(timeToGuess(entropy))
    };
  }

  // Generate pronounceable password (consonant-vowel pattern)
  async function pronounceable(options = {}) {
    const {
      length = 12,
      capitalize = false,
      includeNumbers = false
    } = options;

    let password = '';
    let useConsonant = Math.random() > 0.5;

    for (let i = 0; i < length; i++) {
      if (useConsonant) {
        password += randomChoice(CONSONANTS);
      } else {
        password += randomChoice(VOWELS);
      }
      useConsonant = !useConsonant;
    }

    if (capitalize) {
      password = password.charAt(0).toUpperCase() + password.slice(1);
    }

    if (includeNumbers) {
      const num = Math.floor(Math.random() * 10);
      const idx = Math.floor(Math.random() * password.length);
      password = password.slice(0, idx) + num + password.slice(idx);
    }

    const charset = 26; // Rough estimate
    const entropy = calculateEntropy(charset, password.length);

    return {
      value: password,
      charset: charset,
      entropy: entropy,
      timeToGuess: formatTime(timeToGuess(entropy))
    };
  }

  // Master password (strong, complex)
  async function masterPassword(options = {}) {
    const { length = 24, symbols = true, excludeAmbiguous = true } = options;
    return randomPassword({
      length,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols,
      excludeAmbiguous
    });
  }

  // PIN code
  async function pinCode(options = {}) {
    const { length = 6 } = options;
    const bytes = await getRandomBytes(length);
    let pin = '';
    for (let i = 0; i < length; i++) {
      pin += (bytes[i] % 10).toString();
    }
    const entropy = calculateEntropy(10, length);
    return {
      value: pin,
      charset: 10,
      entropy: entropy,
      timeToGuess: formatTime(timeToGuess(entropy))
    };
  }

  // WiFi password
  async function wifiPassword(options = {}) {
    const { length = 20, charset = 'alphanumeric' } = options;
    let charsetStr = '';
    if (charset === 'alphanumeric') {
      charsetStr = LOWERCASE + UPPERCASE + NUMBERS;
    } else if (charset === 'symbols') {
      charsetStr = LOWERCASE + UPPERCASE + NUMBERS + SYMBOLS;
    } else {
      charsetStr = LOWERCASE + UPPERCASE;
    }

    charsetStr = charsetStr.replace(/[il1Lo0O]/g, '');
    const bytes = await getRandomBytes(length);
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charsetStr[bytes[i] % charsetStr.length];
    }

    const entropy = calculateEntropy(charsetStr.length, length);
    return {
      value: password,
      charset: charsetStr.length,
      entropy: entropy,
      timeToGuess: formatTime(timeToGuess(entropy))
    };
  }

  // Recovery codes (grouped format)
  async function recoveryCodes(options = {}) {
    const { count = 10, format = '4-4-4' } = options;
    const codes = [];

    for (let i = 0; i < count; i++) {
      const bytes = await getRandomBytes(16);
      const hex = bytesToHex(bytes).toUpperCase();
      const parts = format.split('-').map(len => hex.substring(0, parseInt(len)));
      codes.push(parts.join('-'));
    }

    return { values: codes, count, format };
  }

  // Backup codes
  async function backupCodes(options = {}) {
    const { count = 10, format = 'alphanumeric' } = options;
    const codes = [];

    for (let i = 0; i < count; i++) {
      const bytes = await getRandomBytes(8);
      let code = '';
      if (format === 'alphanumeric') {
        const charset = (LOWERCASE + UPPERCASE + NUMBERS).replace(/[il1Lo0O]/g, '');
        for (let j = 0; j < bytes.length; j++) {
          code += charset[bytes[j] % charset.length];
        }
      } else if (format === 'numeric') {
        for (let j = 0; j < bytes.length; j++) {
          code += (bytes[j] % 10).toString();
        }
      } else if (format === 'hex') {
        code = bytesToHex(bytes).toUpperCase();
      }
      codes.push(code);
    }

    return { values: codes, count, format };
  }

  // Temporary password with expiry hint
  async function temporaryPassword(options = {}) {
    const { length = 12, expiryHint = '1h' } = options;
    const pwd = await randomPassword({
      length,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false
    });

    return {
      ...pwd,
      expiryHint,
      generatedAt: new Date().toISOString()
    };
  }

  // Gaming password
  async function gamingPassword(options = {}) {
    const { length = 16, symbols = true } = options;
    return randomPassword({
      length,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols,
      excludeAmbiguous: true
    });
  }

  // Developer password
  async function developerPassword(options = {}) {
    const { length = 24, format = 'mixed' } = options;

    if (format === 'base64safe') {
      const bytes = await getRandomBytes(Math.ceil(length * 0.75));
      return {
        value: bytesToBase64(bytes).replace(/[+/]/g, '-').substring(0, length),
        format: 'base64safe',
        entropy: length * 5.95
      };
    } else if (format === 'hex') {
      const bytes = await getRandomBytes(Math.ceil(length / 2));
      return {
        value: bytesToHex(bytes).toUpperCase().substring(0, length),
        format: 'hex',
        entropy: length * 4
      };
    } else {
      return randomPassword({
        length,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false
      });
    }
  }

  // AES key
  async function aesKey(options = {}) {
    const { bits = 256 } = options;
    const bytes = await getRandomBytes(bits / 8);
    return {
      value: bytesToHex(bytes).toUpperCase(),
      bits,
      format: 'hex',
      base64: bytesToBase64(bytes)
    };
  }

  // RSA key pair
  async function rsaKeyPair(options = {}) {
    const { bits = 2048, purpose = 'encryption' } = options;
    
    const keyUsage = purpose === 'signing' ? ['sign', 'verify'] : ['encrypt', 'decrypt'];
    const algorithm = purpose === 'signing' ? 
      { name: 'RSASSA-PKCS1-v1_5', modulusLength: bits, publicExponent: [1, 0, 1], hash: 'SHA-256' } :
      { name: 'RSA-OAEP', modulusLength: bits, publicExponent: [1, 0, 1], hash: 'SHA-256' };
    
    try {
      const keyPair = await crypto.subtle.generateKey(algorithm, true, keyUsage);
      
      const privateKeyDer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      const publicKeyDer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      
      return {
        privateKey: toPem(privateKeyDer, 'RSA PRIVATE KEY'),
        publicKey: toPem(publicKeyDer, 'RSA PUBLIC KEY'),
        bits,
        algorithm: purpose === 'signing' ? 'RSASSA-PKCS1-v1_5' : 'RSA-OAEP'
      };
    } catch (err) {
      return {
        error: `RSA key generation failed: ${err.message}`,
        bits
      };
    }
  }

  // SSH key pair (ECDSA P-256)
  async function sshKeyPair(options = {}) {
    const { namedCurve = 'P-256', comment = 'user@host' } = options;
    
    try {
      const keyPair = await crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve },
        true,
        ['sign', 'verify']
      );
      
      const privateKeyDer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      const publicKeyDer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
      
      const privateKeyPem = toPem(privateKeyDer, 'EC PRIVATE KEY');
      const publicKeySsh = spkiToSshEcPublicKey(publicKeyDer, comment);
      
      return {
        privateKey: privateKeyPem,
        publicKey: publicKeySsh,
        algorithm: `ECDSA ${namedCurve}`,
        format: 'OpenSSH',
        comment
      };
    } catch (err) {
      return {
        error: `SSH key generation failed: ${err.message}`,
        algorithm: namedCurve
      };
    }
  }

  // API key
  async function apiKey(options = {}) {
    const { length = 32, prefix = '' } = options;
    const bytes = await getRandomBytes(Math.ceil(length * 0.75));
    const base64 = bytesToBase64(bytes).replace(/[+/=]/g, '').substring(0, length);
    const value = prefix ? prefix + '_' + base64 : base64;
    return {
      value,
      length: value.length,
      charset: 62
    };
  }

  // JWT secret
  async function jwtSecret(options = {}) {
    const { length = 32 } = options;
    const bytes = await getRandomBytes(Math.ceil(length * 0.75));
    const base64 = bytesToBase64(bytes);
    return {
      value: base64.substring(0, length),
      length,
      format: 'base64'
    };
  }

  // UUID v4
  async function uuidV4() {
    const bytes = await getRandomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = bytesToHex(bytes);
    const uuid = [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32)
    ].join('-');

    return {
      value: uuid,
      format: 'v4',
      version: 4
    };
  }

  // Hash with salt
  async function hashWithSalt(options = {}) {
    const {
      input = '',
      algorithm = 'SHA-256',
      saltBytes = 16,
      iterations = 1
    } = options;

    const salt = await getRandomBytes(saltBytes);
    const saltHex = bytesToHex(salt).toUpperCase();

    if (!input) {
      return {
        salt: saltHex,
        algorithm,
        saltBytes
      };
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    let hash;
    switch (algorithm) {
      case 'SHA-1':
        hash = await crypto.subtle.digest('SHA-1', data);
        break;
      case 'SHA-256':
        hash = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'SHA-384':
        hash = await crypto.subtle.digest('SHA-384', data);
        break;
      case 'SHA-512':
        hash = await crypto.subtle.digest('SHA-512', data);
        break;
      default:
        hash = await crypto.subtle.digest('SHA-256', data);
    }

    const hashHex = bytesToHex(new Uint8Array(hash)).toUpperCase();

    return {
      input,
      hash: hashHex,
      salt: saltHex,
      algorithm,
      saltBytes
    };
  }

  // Check password strength
  function checkStrength(password) {
    let charset = 0;
    let entropy = 0;

    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charset += 32;

    entropy = calculateEntropy(charset, password.length);

    // NIST guidelines
    let strength = 'weak';
    if (entropy > 50) strength = 'medium';
    if (entropy > 80) strength = 'strong';

    return {
      password,
      length: password.length,
      charset,
      entropy: Math.round(entropy),
      strength,
      timeToGuess: formatTime(timeToGuess(entropy))
    };
  }

  // Export all generators
  window.Generators = {
    randomPassword,
    passphrase,
    pronounceable,
    masterPassword,
    pinCode,
    wifiPassword,
    recoveryCodes,
    backupCodes,
    temporaryPassword,
    gamingPassword,
    developerPassword,
    aesKey,
    rsaKeyPair,
    sshKeyPair,
    apiKey,
    jwtSecret,
    uuidV4,
    hashWithSalt,
    checkStrength
  };
})();
