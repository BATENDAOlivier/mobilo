import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Bus, User, LogOut, LayoutDashboard } from "lucide-react"
import { getCurrentUser, setCurrentUser } from "@/lib/storage"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useTranslation } from "react-i18next"
import LanguageSwitcher from "./LanguageSwitcher"

const Navbar = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const { t } = useTranslation()

  const handleLogout = () => {
    setCurrentUser(null)
    navigate("/")
  }

  const getDashboardLink = () => {
    if (!user) return "/auth"
    if (user.role === "admin") return "/admin"
    if (user.role === "agency") return "/agency"
    return "/dashboard"
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <img src="/icon.png" className=" w-[70px] " alt="" />

            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Mobilo
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/agencies"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.agencies")}
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.about")}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(getDashboardLink())}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t("nav.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-gradient-accent hover:opacity-90 shadow-button"
              >
                <Link to="/auth">{t("nav.login")}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
