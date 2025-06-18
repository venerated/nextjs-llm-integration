import ChatBox from '@/components/ChatBox'
import NoSsr from '@/components/NoSsr'

export default function Home() {
  return (
    <main className="flex h-dvh text-neutral-300">
      {/* No SSR component necessary here so that server doesn't override browser sessionStorage */}
      <NoSsr>
        <ChatBox />
      </NoSsr>
    </main>
  )
}
