import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import { AlbumIcon, Book, CircleAlert } from "lucide-react"
import Image from "next/image"
import Logo from "./favicon.ico"
import LogoDark from "./favicon-dark.ico"

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image
          src={Logo}
          alt="Aegis Logo"
          width={24}
          height={24}
          className="mr-2 dark:inline-block hidden"
        />
        <Image
          src={LogoDark}
          alt="Aegis Logo Dark"
          width={24}
          height={24}
          className="mr-2 dark:hidden inline-block"
        />
        Aegis Docs
      </>
    ),
  },
  links: [
    {
      text: "Docs",
      url: "/docs",
      icon: <Book />,
      active: "nested-url",
    },
    {
      icon: <AlbumIcon />,
      text: "Guides",
      url: "/guides",
      active: "nested-url",
    },
    {
      text: "Common Errors",
      url: "/errors",
      icon: <CircleAlert />,
      active: "nested-url",
    },
  ],
}
