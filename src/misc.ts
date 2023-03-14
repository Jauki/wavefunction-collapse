

export function getRandomEnumValue<T extends Record<string, string | number>>(enumeration: T): T[keyof T] {
  const values = Object.values(enumeration);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as T[keyof T];
}