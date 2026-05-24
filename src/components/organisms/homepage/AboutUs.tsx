import { getTextStrokeStyle } from '@/lib/textStroke'

const AboutUs = () => {
  return (
    <section id="about-us" className="w-full bg-blue-cs-40 text-neutral-cs-10">
      <div className="mx-auto flex w-full max-w-[1260px] flex-col items-center gap-6 px-6 py-16 text-center sm:px-10 lg:px-[90px] lg:py-[110px]">
        <h2
          className="font-rubikone text-[32px] leading-[40px] text-blue-cs-30 sm:text-[40px] sm:leading-[52px] lg:text-[56px] lg:leading-[70px]"
          style={getTextStrokeStyle({ color: '#ffffff', width: 2 })}
        >
          About Us
        </h2>

        <div className="h-[2px] w-24 bg-blue-cs-20/60 lg:w-300" />

        <div
          className="relative overflow-hidden w-full max-w-[1040px] rounded-[48px] border border-blue-cs-20/60 bg-gradient-to-b from-blue-cs-20 to-blue-cs-30 px-6 py-10 sm:px-10 sm:py-12 lg:px-[104px] lg:py-[70px]"
        >
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/texture/Frame 5.png')"
            }}
            aria-hidden="true"
          />

          <p className="relative z-10 text-base font-semibold leading-7 text-neutral-cs-10 sm:text-lg sm:leading-8 lg:text-[20px] lg:leading-[33px]">
            <span className="text-yellow-cs-20">EVASTRA</span> merupakan nama angkatan Teknologi Informasi ITS 2025
            yang merepresentasikan semangat untuk berkembang bersama, menguatkan karakter, dan meningkatkan
            kompetensi.
            <span className="mt-6 block lg:mt-8">
              Terinspirasi dari pepatah Latin klasik, “<span className="text-yellow-cs-20">ad astra per aspera</span>”
              yang berarti, “melalui rintangan, menuju <span className="text-yellow-cs-20">bintang-bintang</span>”.
              Makna ini menggambarkan <span className="text-yellow-cs-20">EVASTRA</span> yang diharapkan menjadi
              angkatan yang mampu menghadapi rintangan dan menggapai impiannya.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
