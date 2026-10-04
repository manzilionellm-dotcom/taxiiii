import { faqFor } from "@/lib/aio";

/**
 * Citation Hooks: each question heading is followed immediately by its answer
 * paragraph. Server-rendered, always in the document, never an accordion.
 */
export function AioPublic() {
  const faq = faqFor("sv");

  return (
    <section id="fragor" className="space-y-4 pt-2" aria-labelledby="aio-fragor">
      <h2 id="aio-fragor" className="font-serif text-2xl text-black">
        Vanliga frågor
      </h2>
      <div className="space-y-4">
        {faq.map((item) => (
          <article key={item.q} className="card">
            <h3 className="font-serif text-xl leading-snug text-black">{item.q}</h3>
            <p className="mt-3 text-[1.02rem] leading-7 text-[#1f3d2b]">{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
