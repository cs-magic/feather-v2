import Link from "next/link"
import { Github, GithubIcon, LucideGithub } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <div className={"h-full flex flex-col items-center p-4"}>
      <div
        className={
          "grow flex flex-col items-center justify-center gap-4 mx-auto"
        }
      >
        <h1 className={"text-2xl"}>
          欢迎来到
          <span className={"text-yellow-300"}>「吹羽毛」</span>
          小游戏~
        </h1>

        <Link href={"/room/ai"} className={"w-full"}>
          <Button className={"w-full"}>AI对战</Button>
        </Link>
        <Link href={"/room/ai"} className={"w-full"}>
          <Button className={"w-full"}>好友对战</Button>
        </Link>
      </div>

      <div className={"flex items-center gap-4"}>
        <Link href={"/about"} className={"link"}>
          关于
        </Link>
        <Link
          href={siteConfig.links.github}
          target={"_blank"}
          className={"link"}
        >
          贡献开源 <Github size={20} />
        </Link>
      </div>
    </div>
  )
}
