import { asset, cn } from "@/lib/utils";
import type { ProductKey } from "@/lib/content";

const PORTRAIT = asset("/themes/royalty_portrait.png");

function PortraitPanel({ className, image = PORTRAIT }: { className?: string; image?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={image}
        alt="Portrait"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

/** `finish` previews the chosen option: frame "black" or mug color "black". */
type MockProps = { image?: string; finish?: string };

function FramedPrintMock({ image = PORTRAIT, finish }: MockProps) {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        className="relative w-[58%] max-w-[230px] rounded-[10px] p-3 shadow-[0_40px_80px_-30px_rgba(20,17,13,0.45)]"
        style={{
          background:
            finish === "black"
              ? "linear-gradient(145deg, #3a3632, #1f1c19 55%, #0f0d0b)"
              : "linear-gradient(145deg, #8a6d44, #6f5630 55%, #4d3c22)",
        }}
      >
        <div className="overflow-hidden rounded-[6px] bg-surface p-2 ring-1 ring-black/10">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
            <img
              src={image}
              alt="Tirage encadré"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MugMock({ image, finish }: MockProps) {
  const dark = finish === "black";
  return (
    <div className="relative flex h-full items-end justify-center pb-7">
      <div className="relative mb-2">
        {/* handle */}
        <div
          className={`absolute -right-7 top-9 h-[82px] w-9 rounded-r-full border-[10px] border-l-transparent ${dark ? "border-[#24211e]" : "border-[#e4dfd6]"}`}
          style={{ boxShadow: "inset -2px 0 4px rgba(20,17,13,0.06)" }}
        />
        {/* body */}
        <div
          className={`relative h-[196px] w-[138px] overflow-hidden rounded-b-[34px] rounded-t-[10px] bg-gradient-to-br shadow-[0_28px_50px_-20px_rgba(20,17,13,0.35)] ${
            dark ? "from-[#3a3632] via-[#24211e] to-[#14110d]" : "from-[#f7f5f1] via-[#edeae3] to-[#ddd8cf]"
          }`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-3.5 rounded-t-[10px] ring-1 ring-inset ring-white/60 ${dark ? "bg-[#2a2724]" : "bg-[#f0ece4]"}`}
          />
          <div className="absolute inset-x-0 top-3.5 h-px bg-ink/8" />
          <PortraitPanel image={image} className="absolute inset-x-5 top-9 bottom-[48px] overflow-hidden rounded-md shadow-inner" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/6 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function PhoneCaseMock({ image }: MockProps) {
  return (
    <div className="relative flex h-full items-center justify-center [perspective:900px]">
      <div
        className="relative w-[150px] rounded-[34px] bg-gradient-to-br from-[#2a2826] to-[#14110d] p-[3px] shadow-[0_36px_60px_-18px_rgba(20,17,13,0.55)]"
        style={{ transform: "rotateY(-14deg) rotateX(6deg)" }}
      >
        <div className="relative aspect-[9/19] overflow-hidden rounded-[31px]">
          <PortraitPanel image={image} className="absolute inset-0" />
          {/* camera module */}
          <div className="absolute left-3 top-3 flex gap-1.5 rounded-2xl bg-ink/75 p-2 backdrop-blur-sm">
            <span className="h-4 w-4 rounded-full bg-ink ring-1 ring-white/10" />
            <span className="h-4 w-4 rounded-full bg-ink ring-1 ring-white/10" />
            <span className="h-4 w-4 rounded-full bg-ink/80 ring-1 ring-white/10" />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[31px] ring-1 ring-inset ring-white/15" />
        </div>
      </div>
    </div>
  );
}

export const productMocks: Record<ProductKey, (props: MockProps) => JSX.Element> = {
  print: FramedPrintMock,
  mug: MugMock,
  case: PhoneCaseMock,
};
