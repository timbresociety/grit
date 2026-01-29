import Hero from '@/components/sections/Hero'
import Logos from '@/components/sections/Logos'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import WorkTeaser from '@/components/sections/WorkTeaser'
import ContactCTA from '@/components/sections/ContactCTA'
import Footer from '@/components/ui/Footer'
import EditorialLayout from '@/components/ui/EditorialLayout'
import PinnedSection from '@/components/ui/PinnedSection'

export default function Home() {
  return (
    <EditorialLayout>
      <div className="flex flex-col w-full">
        {/* Each section is pinned during its frame range */}
        {/* Higher z-index for LATER sections so they scroll OVER previous sticky ones */}
        <PinnedSection sectionId="hero" id="hero" dataSection="hero" zIndex={10}>
          <Hero />
        </PinnedSection>

        <PinnedSection sectionId="services" id="services" dataSection="services" zIndex={20} pinContent={false}>
          <Services />
        </PinnedSection>

        <PinnedSection sectionId="operator" id="logos" dataSection="operator" zIndex={30}>
          <Logos />
        </PinnedSection>

        <PinnedSection sectionId="process" id="process" dataSection="process" pinContent={false} zIndex={40}>
          <Process />
        </PinnedSection>

        <PinnedSection sectionId="work" id="work" dataSection="work" pinContent={false} zIndex={50}>
          <WorkTeaser />
        </PinnedSection>

        <PinnedSection sectionId="contact" id="contact" dataSection="contact" pinContent={false} zIndex={60}>
          <ContactCTA />
        </PinnedSection>

        <Footer />
      </div>
    </EditorialLayout>
  )
}
