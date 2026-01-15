import Hero from '@/components/sections/Hero'
import Logos from '@/components/sections/Logos'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import WorkTeaser from '@/components/sections/WorkTeaser'
import ContactCTA from '@/components/sections/ContactCTA'
import Footer from '@/components/ui/Footer'

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Services />
      <Logos />
      <Process />
      <WorkTeaser />
      <ContactCTA />
      <Footer />
    </div>
  )
}
