import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-[#050816] to-[#08101f] py-32"
    >
      <div className="mx-auto max-w-5xl px-6 text-center">

        <SectionTitle
          badge="Kontakt"
          title="Začnimo vaš naslednji projekt"
          description="Povejte nam svojo idejo. Skupaj bomo ustvarili rešitev, ki bo vaše podjetje popeljala na višjo raven."
        />

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

          <div className="grid gap-8 md:grid-cols-2">

            <input
              placeholder="Ime"
              className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none transition focus:border-green-500"
            />

            <input
              placeholder="Email"
              className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none transition focus:border-green-500"
            />

          </div>

          <textarea
            rows={6}
            placeholder="Vaše sporočilo..."
            className="mt-8 w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 outline-none transition focus:border-green-500"
          />

          <div className="mt-10 flex justify-center">
            <Button>
              Pošlji povpraševanje
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}