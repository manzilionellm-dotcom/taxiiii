import { AioPublic } from "@/components/aio-public";
import { HomeScreen } from "@/components/home-screen";
import { jsonLdString } from "@/lib/aio";

export default function HomePage() {
  return (
    <>
      <HomeScreen />
      <AioPublic />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString() }}
      />
    </>
  );
}
