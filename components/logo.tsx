import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/favicon.png"
      alt="Chofer em Londres"
      width={70}
      height={70}
      className="object-contain"
    />
  )
}