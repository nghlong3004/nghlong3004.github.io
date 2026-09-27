"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Send, Mail } from "lucide-react"
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa6"
import { SOCIAL_LINKS } from "@/data/socials"
import { useLanguage } from "@/hooks/useLanguage"

function Footerdemo() {
  const { t, language } = useLanguage()
  const [email, setEmail] = React.useState("")
  const [subscribed, setSubscribed] = React.useState(false)

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail("")
    setTimeout(() => setSubscribed(false), 4000)
  }

  const quickNavLinks = [
    { label: language === "vi" ? "Trang chủ" : "Home", href: "#" },
    { label: t.nav.story, href: "#story" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.impact, href: "#impact" },
    { label: t.nav.honors, href: "#honors" },
  ]

  const getSocialIcon = (label: string) => {
    const key = label.toLowerCase()
    if (key.includes("github")) return <FaGithub className="h-4 w-4" />
    if (key.includes("linkedin")) return <FaLinkedinIn className="h-4 w-4" />
    if (key.includes("instagram")) return <FaInstagram className="h-4 w-4" />
    return <Mail className="h-4 w-4" />
  }

  return (
    <footer
      id="contact"
      className="relative z-20 border-t border-border bg-background text-foreground transition-colors duration-300"
      aria-label="Contact and Footer"
    >
      <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Stay Connected */}
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight font-sans">
              {t.contact.stayConnected}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
              {t.contact.newsletterDesc}
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contact.emailPlaceholder}
                className="pr-12 backdrop-blur-sm bg-card/60 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-pointer shadow-xs active:scale-95"
              >
                <Send className="h-3.5 w-3.5" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            {subscribed && (
              <p className="mt-2 text-xs text-primary font-medium transition-opacity">
                {t.contact.subscribeSuccess}
              </p>
            )}
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold font-sans">
              {t.contact.quickLinks}
            </h3>
            <nav className="space-y-2 text-sm" aria-label="Quick links">
              {quickNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold font-sans">
              {t.contact.contactUs}
            </h3>
            <address className="space-y-2.5 text-sm not-italic text-muted-foreground">
              <p className="font-medium text-foreground">Nguyen Hoang Long</p>
              <p>{t.contact.location}</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:nghlong3004@gmail.com"
                  className="text-foreground transition-colors hover:text-primary font-sans font-medium"
                >
                  nghlong3004@gmail.com
                </a>
              </p>
              <p className="pt-1 text-xs text-muted-foreground/80">
                {t.contact.footerTagline}
              </p>
            </address>
          </div>

          {/* Col 4: Follow Us (Social Links with Tooltip) */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold font-sans">
              {t.contact.followUs}
            </h3>
            <div className="mb-6 flex flex-wrap gap-3">
              <TooltipProvider>
                {SOCIAL_LINKS.map((link) => (
                  <Tooltip key={link.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-border bg-card/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                        asChild
                      >
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={link.label}
                        >
                          {getSocialIcon(link.label)}
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {/* Email shortcut button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-border bg-card/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                      asChild
                    >
                      <a
                        href="mailto:nghlong3004@gmail.com"
                        aria-label="Direct Email"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>nghlong3004@gmail.com</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center text-sm text-muted-foreground md:flex-row">
          <p>{t.contact.copyright}</p>
          <nav className="flex flex-wrap justify-center gap-6 text-sm" aria-label="Footer links">
            <a
              href="https://github.com/nghlong3004"
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-primary"
            >
              GitHub @nghlong3004
            </a>
            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              Back to Top ↑
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo, Footerdemo as Footer }
