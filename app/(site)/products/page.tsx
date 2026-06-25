import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { Flask, Church, ChatText, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { IMAGES } from "@/lib/images";
import { safeFetch } from "@/lib/sanity/client";
import { ALL_PRODUCTS_QUERY, type SanityProduct } from "@/lib/sanity/queries";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Products - PhiNova",
  description:
    "Invitro LIMS, COCM, and Concord SMS — three production-ready systems for labs, churches, and organisations.",
};

const PRODUCTS = [
  {
    productId: "invitro",
    icon: Flask,
    name: "Invitro LIMS",
    tagline: "Clinical-grade laboratory management system",
    description:
      "Built to operate online-first with a local SQLite backup so your lab never halts. From sample intake to result release, with a full audit log and API access.",
    href: "/products/invitro",
    imageSrc: IMAGES.overviewLab,
    imageAlt: "Laboratory science bench with equipment",
    audience: "Clinical laboratories, diagnostic centres",
  },
  {
    productId: "cocm",
    icon: Church,
    name: "COCM",
    tagline: "Resilient offline-first church management",
    description:
      "Track member records, attendance registers, expense budgets, and weekly offerings. Works fully offline and syncs when connectivity returns.",
    href: "/products/cocm",
    imageSrc: IMAGES.overviewChurch,
    imageAlt: "Church interior with light beams",
    audience: "Churches, congregations, faith communities",
  },
  {
    productId: "concord",
    icon: ChatText,
    name: "Concord SMS",
    tagline: "Bulk messaging built for organisations",
    description:
      "Personalised merge tags, campaign scheduling, contact segmentation, and delivery reporting. Integrated with Arkesel for reliable SMS delivery across Ghana.",
    href: "/products/concord",
    imageSrc: IMAGES.overviewSms,
    imageAlt: "Person using smartphone for messaging",
    audience: "NGOs, schools, clinics, churches, campaigns",
  },
];

export default async function ProductsPage() {
  const cmsProducts = await safeFetch<SanityProduct[]>(ALL_PRODUCTS_QUERY);

  const items = PRODUCTS.map((p) => {
    const match = cmsProducts?.find((cp) => cp.productId === p.productId);
    return {
      ...p,
      name: match?.heroTitle || p.name,
      tagline: match?.heroSubtitle || p.tagline,
      description: match?.metaDescription || p.description,
      imageSrc: match?.heroImage?.asset?.url || p.imageSrc,
    };
  });

  return (
    <div className="min-h-[100dvh] pt-28 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Reveal className="mb-14">
          <GlassTiltCard className="max-w-2xl px-8 py-10 md:px-12" maxTilt={4}>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-ink dark:text-canvas">
              Three products, one reliability standard
            </h1>
            <p className="mt-4 text-base text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[48ch]">
              Each PhiNova product is purpose-built for a specific institutional context. All three
              share the same commitment to data integrity and operational continuity.
            </p>
          </GlassTiltCard>
        </Reveal>

        {/* Product cards grid */}
        <div className="flex flex-col gap-6">
          {items.map(({ icon: Icon, name, tagline, description, href, imageSrc, imageAlt, audience }, i) => (
            <Reveal key={name} delay={i * 0.07}>
              <GlassTiltCard className="group overflow-hidden" maxTilt={4}>
                <Link href={href} className="flex flex-col md:flex-row h-full">
                  {/* Image */}
                  <div className="relative md:w-72 shrink-0 h-52 md:h-auto overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      width={600}
                      height={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/20 hidden md:block" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-7 md:p-10 gap-4">
                    <div className="flex items-center gap-3">
                      <Icon size={26} weight="duotone" className="text-steel transition-transform duration-300 group-hover:scale-110" />
                      <div>
                        <h2 className="text-xl font-semibold text-ink dark:text-canvas">{name}</h2>
                        <p className="text-sm text-steel-dark dark:text-steel font-medium">{tagline}</p>
                      </div>
                    </div>
                    <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[52ch]">
                      {description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-xs text-ink/40 dark:text-canvas/40">
                        For: {audience}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel-dark dark:text-steel group-hover:gap-3 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
                        View details <ArrowRight size={14} weight="bold" />
                      </span>
                    </div>
                  </div>
                </Link>
              </GlassTiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
