"use client"

import { Fragment, type HTMLAttributes, useMemo } from "react"
import { cn } from "../../lib/cn"
import { type BaseLayoutProps, getLinks, type NavOptions } from "./shared"
import { NavProvider } from "fumadocs-ui/contexts/layout"
import {
  Navbar,
  NavbarLink,
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from "./home/navbar"
import { type LinkItemType } from "./links"
import { LargeSearchToggle, SearchToggle } from "../layout/search-toggle"
import { ThemeToggle } from "../layout/theme-toggle"
import { LanguageToggle, LanguageToggleText } from "../layout/language-toggle"
import { AlertTriangle, ChevronDown, Languages, Search } from "lucide-react"
import Link from "fumadocs-core/link"
import { Menu, MenuContent, MenuLinkItem, MenuTrigger } from "./home/menu"
import { buttonVariants } from "../ui/button"
import { usePathname } from "next/navigation"

export interface HomeLayoutProps extends BaseLayoutProps {
  nav?: Partial<
    NavOptions & {
      /**
       * Open mobile menu when hovering the trigger
       */
      enableHoverToOpen?: boolean
    }
  >
}

export function HomeLayout(props: HomeLayoutProps & HTMLAttributes<HTMLElement>) {
  const {
    nav = {},
    links,
    githubUrl,
    i18n,
    disableThemeSwitch = true,
    themeSwitch = { enabled: !disableThemeSwitch },
    searchToggle,
    ...rest
  } = props

  return (
    <NavProvider transparentMode={nav?.transparentMode}>
      <main
        id="nd-home-layout"
        {...rest}
        className={cn("flex flex-1 flex-col pt-14", rest.className)}
      >
        {nav.enabled !== false &&
          (nav.component ?? (
            <Header
              links={links}
              nav={nav}
              themeSwitch={themeSwitch}
              searchToggle={searchToggle}
              i18n={i18n}
              githubUrl={githubUrl}
            />
          ))}
        {props.children}
      </main>
    </NavProvider>
  )
}

export function Header({
  nav = {},
  i18n = false,
  links,
  githubUrl,
  themeSwitch = {},
  searchToggle = {},
}: HomeLayoutProps) {
  const pathname = usePathname()
  const finalLinks = useMemo(() => getLinks(links, githubUrl), [links, githubUrl])

  const navItems = finalLinks.filter((item) =>
    ["nav", "all"].includes(item.on ?? "all")
  )

  const menuItems = finalLinks.filter((item) =>
    ["menu", "all"].includes(item.on ?? "all")
  )

  return (
    <>
      <Navbar className="bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/30">
        <Link
          href={nav.url ?? "/"}
          className="inline-flex items-center font-semibold group"
        >
          <span className="text-xl bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            {nav.title}
          </span>
        </Link>

        {nav.children}

        <ul className="flex flex-row items-center gap-1 px-6 max-lg:hidden">
          {navItems
            .filter((item) => !isSecondary(item))
            .map((item, i) => (
              <div key={i}>
                <NavbarLinkItem
                  item={item}
                  className="text-sm text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50 
                    rounded-lg px-3 py-2 transition-all duration-200 flex items-center gap-2
                    border border-transparent hover:border-cyan-500/30"
                />
              </div>
            ))}
        </ul>

        <div className="flex flex-row items-center justify-end gap-2 flex-1">
          {searchToggle.enabled !== false && (
            <>
              {searchToggle.components?.sm ?? (
                <SearchToggle
                  className="p-2 lg:hidden text-slate-300 hover:text-cyan-300 
                  hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  hideIfDisabled
                />
              )}
              {searchToggle.components?.lg ?? (
                <div className="relative max-lg:hidden">
                  <LargeSearchToggle
                    className="w-full rounded-lg ps-3 pe-10 py-2 max-w-[280px] 
                      bg-slate-800/50 border border-slate-700/50 text-slate-300
                      placeholder:text-slate-500 focus:border-cyan-500/50 
                      focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200"
                    hideIfDisabled
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              )}
            </>
          )}

          {themeSwitch.enabled !== false &&
            (themeSwitch.component ?? (
              <ThemeToggle
                className="max-lg:hidden text-slate-300 hover:text-cyan-300 
                  hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-200
                  border border-transparent hover:border-cyan-500/30"
                mode={themeSwitch?.mode}
              />
            ))}

          {i18n ? (
            <LanguageToggle
              className="max-lg:hidden text-slate-300 hover:text-cyan-300 
              hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-200
              border border-transparent hover:border-cyan-500/30"
            >
              <Languages className="size-5" />
            </LanguageToggle>
          ) : null}
        </div>

        <ul className="flex flex-row items-center">
          {navItems.filter(isSecondary).map((item, i) => (
            <NavbarLinkItem
              key={i}
              item={item}
              className="max-lg:hidden text-slate-300 hover:text-cyan-300 
                hover:bg-slate-800/50 rounded-lg px-3 py-2 transition-all duration-200
                border border-transparent hover:border-cyan-500/30"
            />
          ))}

          <Menu className="lg:hidden">
            <MenuTrigger
              aria-label="Toggle Menu"
              className={cn(
                buttonVariants({
                  size: "icon",
                  color: "ghost",
                  className:
                    "group -me-1.5 text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50",
                })
              )}
              enableHover={nav.enableHoverToOpen}
            >
              <ChevronDown className="!size-5.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </MenuTrigger>

            <MenuContent
              className="sm:flex-row sm:items-center sm:justify-end 
              bg-slate-900/95 backdrop-blur-md border-cyan-500/30"
            >
              {menuItems
                .filter((item) => !isSecondary(item))
                .map((item, i) => (
                  <MenuLinkItem
                    key={i}
                    item={item}
                    className="sm:hidden text-slate-300 hover:text-cyan-300 
                      hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  />
                ))}

              <div className="-ms-1.5 flex flex-row items-center gap-2 max-sm:mt-4 max-sm:pt-4 max-sm:border-t max-sm:border-slate-700/50">
                {menuItems.filter(isSecondary).map((item, i) => (
                  <MenuLinkItem
                    key={i}
                    item={item}
                    className="-me-1.5 text-slate-300 hover:text-cyan-300 
                      hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                  />
                ))}

                <div role="separator" className="flex-1" />

                {i18n ? (
                  <LanguageToggle
                    className="text-slate-300 hover:text-cyan-300 
                    hover:bg-slate-800/50 rounded-lg px-2 py-1 transition-all duration-200"
                  >
                    <Languages className="size-4" />
                    <LanguageToggleText />
                    <ChevronDown className="size-3 text-slate-400" />
                  </LanguageToggle>
                ) : null}

                {themeSwitch.enabled !== false &&
                  (themeSwitch.component ?? (
                    <ThemeToggle
                      mode={themeSwitch?.mode}
                      className="text-slate-300 hover:text-cyan-300 
                        hover:bg-slate-800/50 rounded-lg p-2 transition-all duration-200"
                    />
                  ))}
              </div>
            </MenuContent>
          </Menu>
        </ul>
      </Navbar>

      {pathname === "/" && (
        <div className="z-20 bg-red-950/50 backdrop-blur-sm border-b border-red-500/30 text-xs font-mono">
          <div className="max-w-7xl mx-auto px-4 py-1.5">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-red-300">
                SECURITY ALERT: Voidseer activity detected in outer sectors
              </span>
              <div className="w-1.5 h-1.5 mt-0.5 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function NavbarLinkItem({
  item,
  ...props
}: {
  item: LinkItemType
  className?: string
}) {
  if (item.type === "custom") return <div {...props}>{item.children}</div>

  if (item.type === "menu") {
    const children = item.items.map((child, j) => {
      if (child.type === "custom") return <Fragment key={j}>{child.children}</Fragment>

      const {
        banner = child.icon ? (
          <div className="w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4">
            {child.icon}
          </div>
        ) : null,
        ...rest
      } = child.menu ?? {}

      return (
        <NavbarMenuLink key={j} href={child.url} external={child.external} {...rest}>
          {rest.children ?? (
            <>
              {banner}
              <p className="text-[15px] font-medium">{child.text}</p>
              <p className="text-sm text-fd-muted-foreground empty:hidden">
                {child.description}
              </p>
            </>
          )}
        </NavbarMenuLink>
      )
    })

    return (
      <NavbarMenu>
        <NavbarMenuTrigger {...props}>
          {item.url ? <Link href={item.url}>{item.text}</Link> : item.text}
        </NavbarMenuTrigger>
        <NavbarMenuContent>{children}</NavbarMenuContent>
      </NavbarMenu>
    )
  }

  return (
    <NavbarLink
      {...props}
      item={item}
      variant={item.type}
      aria-label={item.type === "icon" ? item.label : undefined}
    >
      {item.type === "icon" ? item.icon : item.text}
    </NavbarLink>
  )
}

function isSecondary(item: LinkItemType): boolean {
  return ("secondary" in item && item.secondary === true) || item.type === "icon"
}
