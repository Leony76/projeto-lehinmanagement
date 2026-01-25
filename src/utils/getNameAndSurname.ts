export function getNameAndSurname(name: string | null) {
  return name?.split(' ').slice(0, 2).join(' ')
}
