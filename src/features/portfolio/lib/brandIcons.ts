import { FaFacebookF, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6'

export const brandIcons = {
  facebook: FaFacebookF,
  github: FaGithub,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
}

export type BrandIconName = keyof typeof brandIcons
