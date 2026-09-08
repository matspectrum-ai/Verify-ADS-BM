const CHECKSUM_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CHECKSUM_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

const RANGES = [
  ["53", 100000, 110000], ["54", 100000, 110000], ["55", 100000, 110000],
  ["56", 100000, 110000], ["57", 100000, 102000],
  ["45", 100000, 105000], ["46", 100000, 105000], ["47", 100000, 105000],
  ["48", 100000, 105000], ["49", 100000, 105000],
  ["41", 100000, 103000], ["42", 100000, 103000], ["43", 100000, 103000],
] as const;

function digit(value: string, weights: readonly number[]) {
  const sum = value.split("").reduce((total, n, index) => total + Number(n) * weights[index], 0);
  const rest = sum % 11;
  return rest < 2 ? "0" : String(11 - rest);
}

function completeCnpj(base: string, suffix: string) {
  const root = `${base}${suffix}`;
  const first = digit(root, CHECKSUM_1);
  const second = digit(`${root}${first}`, CHECKSUM_2);
  return `${root}${first}${second}`;
}

export const CNPJ_WORDLIST_2025 = [
  "00000000000191",
  ...RANGES.flatMap(([base, start, end]) => {
    const values: string[] = [];
    for (let value = start; value < end; value += 100) {
      const middle = value.toString().padStart(6, "0");
      const root = `${base}${middle}`;
      for (let suffix = 1; suffix <= 5; suffix += 1) {
        values.push(completeCnpj(root, suffix.toString().padStart(4, "0")));
      }
    }
    return values;
  }),
];
