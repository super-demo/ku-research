import { Frame, LifeBuoy, Send, SquareTerminal } from "lucide-react"

import { path } from "@/constants/path"

export const NavMockData = {
  navMain: [
    {
      title: "HOME",
      url: path.HOME,
      icon: SquareTerminal,
      isActive: true,
      items: []
    }
  ],
  navSecondary: [
    {
      name: "Settings",
      url: "#",
      icon: Frame
    }
  ],
  navSupport: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send
    }
  ]
}
